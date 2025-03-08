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
filename = "transform_table_incidents"

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
LawIncidentTable <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentTable")
GeoAddress <- dbReadTable(conn_HazelCrestRawTables, "GeobaseAddressIDMaintenance")

# LookUp Tables -----------------------------------------------------------

HowReceivedCodes <- dbReadTable(conn_HazelCrestRawTables, "HowReceivedCodes")
LawIncidentDispositionCodes <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentDispositionCodes")
NatureOfCallTable <- dbReadTable(conn_HazelCrestRawTables, "NatureOfCallTable")

# Aggregation Files --------------------------------------------------------
IncidentAggregationFile <- dbReadTable(conn_HazelCrestRawTables, "IncidentAggregationFile")
IncidentTypeLocationFilter <- read_csv(file.path(home, config$paths$static_dir, "incident_filter.csv"))

# Transform Main Tables & Join LookUp Tables ------------------------------
flog.info("Starting data transformation and joining lookup tables.")
LawIncidentTable_Filtered <-
  LawIncidentTable %>%
  select(
    TimeDateReported,
    IncidentNumber,
    LongTermCallID,
    IncidentNature,
    Disposition,
    GeobaseAddressID,
    AgencyCode,
    HowReceived,
    ResponsibleOfficer,
    GeobaseAddressID,
    City
  ) %>%
  mutate(
    GeobaseAddressID = as.character(as.numeric(GeobaseAddressID))
  ) %>%
  
  left_join(HowReceivedCodes, 
            by=c("HowReceived"="HowReceivedCode")
            ) %>%
  select(
    -HowReceived, 
  ) %>%
  rename(
    HowReceived=Description
  ) %>%
  
  # Let's fix the disposition code column. All numbers need to start with 
  # leading 0
  # The disposition codes are not formatted correctly. All numbers must be reformatted. 
  mutate(
    Disposition = if_else(grepl("\\.", Disposition), 
                          str_replace(Disposition, "\\.0", ""), 
                          Disposition),
    Disposition = if_else(
      grepl("^\\d+$", Disposition) & substr(Disposition, 1, 1) != "0" & str_length(Disposition) < 2,
      paste0("0", Disposition),
      as.character(Disposition)
    ), 
    Disposition = if_else(Disposition == "0", paste0(0, Disposition), Disposition)
  ) %>%
  
  left_join(
    LawIncidentDispositionCodes %>%
      select(DispositionCode, Description), 
    by=c("Disposition"="DispositionCode")
  ) %>%
  select(
    -Disposition
  ) %>%
  rename(
    IncidentDisposition = Description
  ) %>%
  
  left_join(
    NatureOfCallTable %>%
      select(NatureOfCall, IncidentCallNature = AdditionalDescription), 
    by=c("IncidentNature"="NatureOfCall")
  ) %>%
  
  left_join(
    IncidentAggregationFile %>%
      select(IncidentNature, IncidentType), 
    by=c("IncidentNature"="IncidentNature")
  )

GeoAddress_Filtered <-
  GeoAddress %>%
  select(
    IDNumberOfAddress,
    Between,
    XCoordinate,
    YCoordinate
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

# Join Transformed Main Tables into Single Derived Table ------------------
Incidents_Derived <-
  LawIncidentTable_Filtered %>%
  left_join(
    GeoAddress_Filtered, 
    by=c("GeobaseAddressID"="IDNumberOfAddress")
  ) %>%
  mutate(
    TimeDateReported = as.character(as.POSIXct(TimeDateReported, format='%H:%M:%S %m/%d/%Y')),
    LastUpdated = as.character(now())
  )  %>%
  mutate(
    Longitude = if_else(IncidentNature %in% IncidentTypeLocationFilter$IncidentNature, NA, Longitude),
    Latitude = if_else(IncidentNature %in% IncidentTypeLocationFilter$IncidentNature, NA, Latitude),
    Location = if_else(IncidentNature %in% IncidentTypeLocationFilter$IncidentNature, NA, Location)
  ) %>%
  select(
    TimeDateReported,
    IncidentNumber,
    LongTermCallID,
    IncidentCallNature,
    IncidentType,
    Location,
    Longitude,
    Latitude,
    HowReceived,
    AgencyCode,
    City,
    IncidentDisposition,
    LastUpdated
  )

# 24 Hr Filter
Incidents_Derived_Today <- Incidents_Derived %>%
  filter(
    as.Date(TimeDateReported, "%Y-%m-%d", tz = "America/Chicago") == today("America/Chicago") - days(1)
  )

# Write Derived File ------------------------------------------------------
tryCatch({
    dbWriteTable(conn_HazelCrestDerivedTables,
                 "Incidents",
                 Incidents_Derived,
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
