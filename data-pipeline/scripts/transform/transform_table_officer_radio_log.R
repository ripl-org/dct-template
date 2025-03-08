# Load Libraries ----------------------------------------------------------
library(here)
library(lubridate)
library(stringr)
library(tidyverse)
library(RSQLite)
library(yaml)
library(futile.logger)

home = path.expand("~")
filename = "transform_table_officer_radio_log"

# Set-up Logging ----------------------------------------------------------
datetime_stamp <- format(Sys.time(), "%Y%m%d_%H%M%S")
log_dir <- file.path(home, "airflow", "logs", "scripts=transform", filename)
log_file <- file.path(log_dir,
                      paste0(datetime_stamp, 
                             "__", filename, ".log"))

# Check if the directory exists, if not, create it
if (!file_test("-d", log_dir)) {
  dir.create(log_dir, recursive = TRUE)
  cat(sprintf("Created log directory: %s\n", log_dir))
}

flog.appender(appender.file(log_file))
flog.threshold(INFO)

# Read in CONFIG File -----------------------------------------------------
flog.info("Loading config file")
config <- yaml.load_file(file.path(home, "airflow", "config.yaml"))

# DB Connection -----------------------------------------------------------
tryCatch({
  conn_HazelCrestRawTables <- dbConnect(SQLite(), file.path(home, config$databases$raw_tables))
  conn_HazelCrestDerivedTables <- dbConnect(SQLite(), file.path(home, config$databases$derived_tables))
}, error = function(e) {
  flog.error(paste("Error in database connection:", e$message))
})

# Load Data Tables --------------------------------------------------------
flog.info("Loading data tables.")
CADMasterCallTable <- dbReadTable(conn_HazelCrestRawTables, "CADMasterCallTable")
OfficerRadioLogTable <- dbReadTable(conn_HazelCrestRawTables, "OfficerRadioLogTable")

# LookUp Tables -----------------------------------------------------------
NatureOfCallTable <- dbReadTable(conn_HazelCrestRawTables, "NatureOfCallTable")
HowReceivedCodes <- dbReadTable(conn_HazelCrestRawTables, "HowReceivedCodes")

# Aggregation Files --------------------------------------------------------
CallTypeAggregationFile <- dbReadTable(conn_HazelCrestRawTables, "CallTypeAggregationFile")

# Transform Main Tables & Join LookUp Tables ------------------------------
flog.info("Starting data transformation and joining lookup tables.")
OfficerRadioLogTable_Filtered <-
  OfficerRadioLogTable %>%
  select(
    TimeOfStatusChange,
    LongTermCallID,
    AgencyCode,
    OfficerName,
    UnitStatus,
    UnitZoneCode
    ) %>%

  filter(grepl("ARRVD|CMPLT", UnitStatus)
  ) %>%

  # Filter out all Arrived/Completed calls without a LongTermID
  filter(!is.na(LongTermCallID)
  ) %>%

  # Ensure there are no duplicates
  distinct() %>%

  mutate(DateOccured = as.Date(TimeOfStatusChange, '%H:%M:%S %m/%d/%Y'),
         TimeOfStatusChange = as.POSIXct(TimeOfStatusChange, format='%H:%M:%S %m/%d/%Y')
  ) %>%

  select(DateOccured,
         TimeOfStatusChange,
         LongTermCallID,
         AgencyCode,
         UnitZoneCode,
         OfficerName,
         UnitStatus
  )

CADMasterCallTable_Filtered <-
  CADMasterCallTable %>%

  # Select Required columns for derived tables
  select(
    RecordNumber,
    TimeDateReported,
    CallPriority,
    CallNature,
    HowReceived,
  ) %>%

  # Join Call Method Table
  left_join(
    HowReceivedCodes %>%
      select(
        HowReceivedCode,
        CallMethod = Description
      ), by=c("HowReceived"="HowReceivedCode")
  ) %>%

  # Join Call Type Aggregate File
  left_join(
    CallTypeAggregationFile %>%
      select(
        Nature,
        CallType
      ),
    by=c("CallNature"="Nature")
  ) %>%

  mutate(
    TimeDateReported = as.POSIXct(TimeDateReported, format='%H:%M:%S %m/%d/%Y')
  ) %>%

  # Join CallNature Table
  left_join(
    NatureOfCallTable %>%
      select(NatureOfCall,
             CallNatureDescription = AdditionalDescription
      ),
    by=c("CallNature"="NatureOfCall")
  ) %>%

  select(
    -c(CallNature, HowReceived)
  ) %>%
  rename(HowReceived = CallMethod)

# Join Transformed Main Tables into Single Derived Table ------------------

OfficerRadioLogTable_All <-
  OfficerRadioLogTable_Filtered %>%
  left_join(CADMasterCallTable_Filtered,
            by=c("LongTermCallID"="RecordNumber")
            ) %>%

  # Take this out
  filter(!is.na(TimeDateReported)
         ) %>%
  # We are filtering only for those call types that were not officer initiated (there are others that could be added
  # but it was decided we would only filter for these three)
  filter(grepl("Telephone|911 Line|In Person", HowReceived))

OfficerRadioLogTable_arrvd <-
  OfficerRadioLogTable_All %>%
  # Sometimes officers hit arrived on scene multiple times. We are selecting the earliest time
  filter(UnitStatus == "ARRVD") %>%
  arrange(TimeOfStatusChange, LongTermCallID, OfficerName) %>%
  group_by(LongTermCallID, OfficerName, UnitStatus) %>%
  slice(1) %>%
  mutate(TimeOfStatusChange = as.character(TimeOfStatusChange))

OfficerRadioLogTable_cmplt <-
  OfficerRadioLogTable_All %>%
  # Sometimes officers hit completed call  multiple times. We are selecting the latest time
  filter(UnitStatus == "CMPLT") %>%
  arrange(desc(TimeOfStatusChange), LongTermCallID, OfficerName) %>%
  group_by(LongTermCallID, OfficerName, UnitStatus) %>%
  slice(1) %>%
  mutate(TimeOfStatusChange = as.character(TimeOfStatusChange))


OfficerRadioLog_Derived <-
  bind_rows(
    OfficerRadioLogTable_cmplt,
    OfficerRadioLogTable_arrvd,
  ) %>%
  pivot_wider(names_from = UnitStatus,
              values_from = TimeOfStatusChange) %>%
  mutate(
    DateTimeArrivedOnScene = as.POSIXct(ARRVD, format='%Y-%m-%d %H:%M:%S'),
    DateTimeCompletedCall = as.POSIXct(CMPLT, format='%Y-%m-%d %H:%M:%S'),
    TimeOnScene_Seconds = as.numeric(DateTimeCompletedCall - DateTimeArrivedOnScene, unit = "secs"),
    ResponseTime_Seconds = as.numeric(DateTimeArrivedOnScene - TimeDateReported, unit = "secs"),
    ResponseTime_Seconds = if_else(ResponseTime_Seconds < 60, 60, as.integer(ResponseTime_Seconds)),
    TimeOnScene_Seconds = if_else(TimeOnScene_Seconds < 60, 60, as.integer(TimeOnScene_Seconds))
    ) %>%
  select(
    -c(
      ARRVD, CMPLT
    )
  ) %>%
  mutate(
      DateOccured = as.character(DateOccured),
      TimeDateReported = as.character(TimeDateReported),
      DateTimeArrivedOnScene = as.character(DateTimeArrivedOnScene),
      DateTimeCompletedCall = as.character(DateTimeCompletedCall),
      LastUpdated = as.character(now())
  ) %>%
  select(
    DateOccured,
    LongTermCallID,
    HowReceived,
    AgencyCode,
    UnitZoneCode,
    OfficerName,
    CallPriority,
    CallNatureDescription,
    CallType,
    TimeDateReported,
    DateTimeArrivedOnScene,
    DateTimeCompletedCall,
    TimeOnScene_Seconds,
    ResponseTime_Seconds,
    LastUpdated
  )

OfficerRadioLog_Derived_Min_ResponseTime <-
    OfficerRadioLog_Derived %>%
    group_by(LongTermCallID) %>%
    filter(ResponseTime_Seconds == min(ResponseTime_Seconds))

# Write Derived File ------------------------------------------------------
tryCatch({
    dbWriteTable(conn_HazelCrestDerivedTables,
                 "OfficerRadioLog",
                 OfficerRadioLog_Derived,
                 overwrite=TRUE
                 )
    flog.info("Derived file written to the database.")
}, error = function(e) {
    flog.error(paste("Error in writing derived file:", e$message))
})

tryCatch({
    dbWriteTable(conn_HazelCrestDerivedTables,
                 "OfficerRadioLogMinResponseTime",
                 OfficerRadioLog_Derived_Min_ResponseTime,
                 overwrite=TRUE
                 )
    flog.info("Derived file written to the database.")
}, error = function(e) {
    flog.error(paste("Error in writing derived file:", e$message))
})


# Disconnect from DB ------------------------------------------------------
tryCatch({
    dbDisconnect(conn_HazelCrestDerivedTables)
    dbDisconnect(conn_HazelCrestRawTables)
    flog.info("Database connections closed. Script execution complete.")
}, error = function(e) {
    flog.error(paste("Error in closing database connections:", e$message))
})
