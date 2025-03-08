# Load Libraries ----------------------------------------------------------
library(here)
library(lubridate)
library(stringr)
library(tidyverse)
library(RSQLite)
library(yaml)
library(futile.logger)
library(jsonlite)

home = path.expand("~")
filename = "transform_table_calls_for_service"

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

# Helper Functions --------------------------------------------------------
flog.info("Loading helper functions")
insert_period <- function(input_string, position) {
  str_sub(input_string, 1, position - 1) %>%
    paste0(".", str_sub(input_string, position, str_length(input_string))
    )
}

# Earth radius/diameter in meters
RAD_METERS = 6356752.
DIA_METERS = 2 * pi * RAD_METERS

# Hazel Crest latitude
LAT = 41.57175652125216

delta_lat = 100 / (DIA_METERS / 360)
delta_lon = 100 / (DIA_METERS * cos(LAT * pi / 180) / 360)

round_lat <- function(lat) {
  # Round Lat to the nearest 100m. Return w. 6 decimal places of precision.
  return(round(delta_lat * round(lat / delta_lat), 6))
}

round_lon <- function(lon) {
  # Round Lat to the nearest 100m. Return w. 6 decimal places of precision.
  return(round(delta_lon * round(lon / delta_lon), 6))
}

# Load Data Tables --------------------------------------------------------
flog.info("Loading data tables.")
# Load Main Tables
CADMasterCallTable <- dbReadTable(conn_HazelCrestRawTables, "CADMasterCallTable")
LawIncidentTable <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentTable")
GeoAddress <- dbReadTable(conn_HazelCrestRawTables, "GeobaseAddressIDMaintenance")

# Load LookUp Tables
HowReceivedCodes <- dbReadTable(conn_HazelCrestRawTables, "HowReceivedCodes")
NatureOfCallTable <- dbReadTable(conn_HazelCrestRawTables, "NatureOfCallTable")
ZoneCodeTable <- dbReadTable(conn_HazelCrestRawTables, "ZoneCodeTable")

# Aggregation Files
CallTypeAggregationFile <- dbReadTable(conn_HazelCrestRawTables, "CallTypeAggregationFile")
# CallTypeLocationFilter <- read_csv(file.path(home, config$paths$archive_dir, "LocationFilter", "call_filter.csv"))

call_natures_to_filter <- c("Juvenile Problem", "Injuries not related to falls", "Gunshot wound,Gunshot Victim",
"Elderly Abuse/Senior Citizen", "Domestic Disturbance", "Domestic Delayed", "Domestic Battery", "DOMESTIC ADVISE",
"Disturbance", "Difficulty in Breathing", "Difficulty Breathing","CO with Illness","Childbirth","Child Endangerment",
"Child Abuse or Neglect","Chest pain/discomfort","Chest Pain","Carbon Monoxide","Animal Bite","ALTERED MENTAL STATUS",
"Allergic reactions","Alarm-Medical","Abdominal pain and problems","Labor pains, active labor","Medical alarm no contact",
"Medical Emergency","Mental Problem","overdose","Personal Injury of Officer","Psych Evaluation or Problem","Psych Prob or Evaluation",
"Runaway Juvenile","Seizure related calls","Sick person, other complaints","Stroke","Subject Choking","Subject In Pain",
"Suicidal Person","Suicide Attempt","Unresponsive Person","Unresponsive, can't wake up")

# Transform Main Tables & Join LookUp Tables ------------------------------
flog.info("Starting data transformation and joining lookup tables")
CADMasterCallTable_Filtered <-
  CADMasterCallTable %>%

  # Select Required columns for derived tables
  select(
    RecordNumber,
    TimeDateReported,
    CallPriority,
    HowReceived,
    CallNature,
    CityCode
  ) %>%

  # Join Call Method Table
  left_join(
    HowReceivedCodes %>%
      select(
        HowReceivedCode,
        CallMethod = Description
      ), by=c("HowReceived"="HowReceivedCode")
  ) %>%

  # Join CallNature Table
  left_join(
    NatureOfCallTable %>%
      select(NatureOfCall,
             CallNatureDescription = AdditionalDescription
             ),
    by=c("CallNature"="NatureOfCall")
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

  # Remove columns that are not required
  select(
    -c(HowReceived)
  )

GeoAddress_Filtered <-
  GeoAddress %>%
  select(
    IDNumberOfAddress,
    Between,
    XCoordinate,
    YCoordinate
  ) %>%
  mutate(
    IDNumberOfAddress = as.numeric(IDNumberOfAddress)
  ) %>%

  # Correct Latitude and Longitude (insert period in correct place)
  mutate(
    Longitude = insert_period(as.character(XCoordinate), 4),
    Latitude = insert_period(as.character(YCoordinate), 3),
    Longitude = round_lon(as.numeric(Longitude)),
    Latitude = round_lat(as.numeric(Latitude)),
    Location = Between,
    IDNumberOfAddress = as.character(IDNumberOfAddress)
  ) %>%
  select(
    -c(
      XCoordinate,
      YCoordinate,
      Between
    )
  )

Incident_Filtered <-
  LawIncidentTable %>%
  select(
    IncidentNumber,
    LongTermCallID,
    GeobaseAddressID,
    AgencyCode,
    AreaLocationCode
  ) %>%
  mutate(
    GeobaseAddressID = as.character(as.numeric(GeobaseAddressID)),
    Zone = case_when(
      AreaLocationCode == "P61" ~ "Zone 1",
      AreaLocationCode == "P62" ~ "Zone 2",
      AreaLocationCode == "P63" ~ "Zone 3",
      TRUE ~ "Other"
    )
  ) %>%
  select(
    IncidentNumber,
    LongTermCallID,
    GeobaseAddressID,
    AgencyCode,
    Zone
  )

# Join Transformed Main Tables into Single Derived Table ------------------

CallsForService_Derived <-
  CADMasterCallTable_Filtered %>%
  left_join(
    Incident_Filtered,
    by=c("RecordNumber"="LongTermCallID")
  ) %>%

  # Filter for only Dispatched Calls
  # We do this by joining Incident Data and filtering out those
  # Rows that are missing IncidentID
  filter(!is.na(IncidentNumber)
         ) %>%
  left_join(
    GeoAddress_Filtered,
    by=c("GeobaseAddressID"="IDNumberOfAddress")
  ) %>%
  select(
    -c(
      GeobaseAddressID,
      CallNature
    )
  ) %>%
  rename(
    CallNature = CallNatureDescription
  ) %>%
  mutate(
    TimeDateReported = as.character(as.POSIXct(TimeDateReported, format='%H:%M:%S %m/%d/%Y')),
    LastUpdated = as.character(now())
  ) %>%
  select(
    RecordNumber,
    TimeDateReported,
    CallPriority,
    CityCode,
    CallMethod,
    CallNature,
    CallType,
    IncidentNumber,
    AgencyCode,
    Zone,
    Longitude,
    Latitude,
    Location,
    LastUpdated
  ) %>%
  mutate(
    Longitude = if_else(CallNature %in% call_natures_to_filter, NA, Longitude),
    Latitude = if_else(CallNature %in% call_natures_to_filter, NA, Latitude),
    Location = if_else(CallNature %in% call_natures_to_filter, NA, Location),
  )

TrafficStops_Derived <- CallsForService_Derived %>%
    filter(CallNature == "Traffic Stop") %>%
    rename(LongTermCallID = RecordNumber) %>%
    mutate(RecordNumber = IncidentNumber) %>%
    select(
    LongTermCallID,
    IncidentNumber,
    RecordNumber,  # delete RecordNumber after push to prod on 3/28/2024
    Occurred = TimeDateReported,
    CityCode,
    AgencyCode,
    Zone,
    Longitude,
    Latitude,
    Location,
    LastUpdated
    )

# Write Derived File ------------------------------------------------------
tryCatch({
    dbWriteTable(
    conn=conn_HazelCrestDerivedTables,
    name="CallsForService",
    value=CallsForService_Derived,
    overwrite=TRUE
    )
    flog.info("Derived file written to the database.")
}, error = function(e) {
    flog.error(paste("Error in writing derived file:", e$message))
})

tryCatch({
  dbWriteTable(conn=conn_HazelCrestDerivedTables,
               name="TrafficStops",
               value=TrafficStops_Derived,
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