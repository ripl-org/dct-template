# Load Libraries ----------------------------------------------------------
library(tidyverse)
library(here)
library(stringr)
library(lubridate)
library(RSQLite)
library(yaml)
library(futile.logger)
library(jsonlite)

home = path.expand("~")
filename = "transform_table_traffic_stops"

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
flog.info("Loading data tables")
CADTrafficStopTable <- dbReadTable(conn_HazelCrestRawTables, "CADTrafficStopTable")
GeoAddress <- dbReadTable(conn_HazelCrestRawTables, "GeobaseAddressIDMaintenance")

# Transform Main Tables & Join LookUp Tables ------------------------------

CADTrafficStopTable_Filtered <-
  CADTrafficStopTable %>%
  select(
    RecordNumber,
    LongTermCallID,
    Occurred,
    GeobaseAddressID,
    CityCode,
    AgencyCode,
    CallZoneCode
  ) %>%
  mutate(
    Zone = case_when(
      CallZoneCode == "P61" ~ "Zone 1",
      CallZoneCode == "P62" ~ "Zone 2",
      CallZoneCode == "P63" ~ "Zone 3",
      TRUE ~ "Other"
    )
  ) %>%
  select(-CallZoneCode)

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
flog.info("Starting data transformation and joining lookup tables")
TrafficStops_Derived <-
  CADTrafficStopTable_Filtered %>%
  left_join(
    GeoAddress_Filtered,
    by=c("GeobaseAddressID"="IDNumberOfAddress")
  ) %>%

  select(
    -c("GeobaseAddressID")
  ) %>%
  mutate(
    Occurred = as.character(as.POSIXct(Occurred, format='%H:%M:%S %m/%d/%Y')),
    LastUpdated = as.character(now())
  ) %>%
  select(
    RecordNumber,
    LongTermCallID,
    Occurred,
    CityCode,
    AgencyCode,
    Zone,
    Longitude,
    Latitude,
    Location,
    LastUpdated
  )

# # Write Derived File ------------------------------------------------------
# tryCatch({
#   dbWriteTable(conn=conn_HazelCrestDerivedTables,
#                name="TrafficStops",
#                value=TrafficStops_Derived,
#                overwrite=TRUE
#                )
#   flog.info("Derived file written to the database.")
# }, error = function(e) {
#   flog.error(paste("Error in writing derived file:", e$message))
# })

# Disconnect from DB ------------------------------------------------------
tryCatch({
  dbDisconnect(conn_HazelCrestDerivedTables)
  dbDisconnect(conn_HazelCrestRawTables)
  flog.info("Database connections closed. Script execution complete.")
}, error = function(e) {
  flog.error(paste("Error in closing database connections:", e$message))
})