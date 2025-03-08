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
filename = "transform_table_offense"

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

round_lat <- function(lat) {

  # Earth radius/diameter in meters
  RAD_METERS = 6356752.
  DIA_METERS = 2 * pi * RAD_METERS

  # Hazel Crest latitude
  LAT = 41.57175652125216

  delta_lat = 100 / (DIA_METERS / 360)
  # Round Lat to the nearest 100m. Return w. 6 decimal places of precision.
  return(round(delta_lat * round(lat / delta_lat), 6))
}

round_lon <- function(lon) {
  # Earth radius/diameter in meters
  RAD_METERS = 6356752.
  DIA_METERS = 2 * pi * RAD_METERS

  # Hazel Crest latitude
  LAT = 41.57175652125216

  delta_lon = 100 / (DIA_METERS * cos(LAT * pi / 180) / 360)
  # Round Lat to the nearest 100m. Return w. 6 decimal places of precision.
  return(round(delta_lon * round(lon / delta_lon), 6))
}
# Load Data Tables --------------------------------------------------------
flog.info("Loading data tables.")
LawIncidentTable <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentTable")
GeoAddress <- dbReadTable(conn_HazelCrestRawTables, "GeobaseAddressIDMaintenance")
LawIncidentOffensesDetail <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentOffensesDetail")

# LookUp Tables -----------------------------------------------------------
OffenseCodes <- dbReadTable(conn_HazelCrestRawTables, "OffenseCodes")
StatuteCodesTable  <- dbReadTable(conn_HazelCrestRawTables, "StatuteCodesTable")
LawIncidentDispositionCodes <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentDispositionCodes")

# Aggregation Files --------------------------------------------------------
NIBRSOffenseCodes <- dbReadTable(conn_HazelCrestRawTables, "NIBRSOffenseCodes")
LocalOffenseDescriptionToNIBRSCodes <- dbReadTable(conn_HazelCrestRawTables, "LocalOffenseDescriptionToNIBRSCodes")
OffenseTypeLocationFilter <- read_csv(file.path(home, config$paths$archive_dir, "LocationFilter", "offense_filter.csv"))

# Transform Main Tables & Join LookUp Tables ------------------------------
flog.info("Starting data transformation and joining lookup tables.")

LawIncidentOffenseDetails_Filtered <-
  LawIncidentOffensesDetail %>%
  filter(grepl("Z|z", IncidentNumber)
         ) %>%
  select(
    IncidentNumber,
    LocalOffenseCode = OffenseCode,
    StatuteCode
  ) %>%

  # Join Offense Codes to get LocalOffenseDescription Column
  left_join(
    OffenseCodes %>%
      select(
        CodeForOffense,
        LocalOffenseDescription = OffenseDescription
      ),
    by=c("LocalOffenseCode" = "CodeForOffense")
  ) %>%

  # Join statute Codes
  left_join(
    StatuteCodesTable %>%
      select(
        StatuteCode,
        StatuteDescription = Description
      ),
    by=c("StatuteCode")
  ) %>%

  # Join Local Offense Description to NIBRS Codes
  left_join(
    LocalOffenseDescriptionToNIBRSCodes %>%
      select(
        LocalOffenseDescription,
        NIBRSCode
      ),
    by=c("LocalOffenseDescription"="LocalOffenseDescription")
  ) %>%

  # Join NIBRS Information
  left_join(
    NIBRSOffenseCodes,
    by=c("NIBRSCode" = "NIBRSOffenseCode")
  ) %>%

  select(
    IncidentNumber,
    LocalOffenseCode,
    LocalOffenseDescription,
    StatuteCode,
    StatuteDescription,
    NIBRSCode,
    NIBRSOffenseCategory,
    NIBRSOffense,
    NIBRSCrimeAgainst,
    UCRParts,
    CrimeCategory
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

LawIncidentTable_Filtered <-
  LawIncidentTable %>%
  select(
    IncidentNumber,
    LongTermCallID,
    Disposition,
    TimeDateReported,
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
    LawIncidentDispositionCodes,
    by=c("Disposition"="DispositionCode")
  ) %>%
  select(
    IncidentNumber,
    LongTermCallID,
    Disposition,
    TimeDateReported,
    IncidentDisposition = Description,
    GeobaseAddressID,
    AgencyCode,
    Zone
  )

# Join Transformed Main Tables into Single Derived Table ------------------

Offense_Derived <-
  LawIncidentOffenseDetails_Filtered %>%
  left_join(
    LawIncidentTable_Filtered,
    by=c("IncidentNumber"),
    relationship = "many-to-many"
  ) %>%

  left_join(
    GeoAddress_Filtered,
    by=c("GeobaseAddressID"="IDNumberOfAddress")
  ) %>%

  # Filter for crimes only
  filter(!is.na(NIBRSCode)
         ) %>%
  select(
    -c(
      GeobaseAddressID
    )
  ) %>%
  mutate(
    TimeDateReported = as.POSIXct(TimeDateReported, format='%H:%M:%S %m/%d/%Y'),
    TimeDateReported = as.character(TimeDateReported),
    LastUpdated = as.character(now())
  ) %>%
  select(
    TimeDateReported,
    IncidentNumber,
    LongTermCallID,
    LocalOffenseCode,
    LocalOffenseDescription,
    StatuteCode,
    StatuteDescription,
    NIBRSCode,
    NIBRSOffenseCategory,
    NIBRSOffense,
    NIBRSCrimeAgainst,
    UCRParts,
    CrimeCategory,
    IncidentDisposition,
    AgencyCode,
    Zone,
    Longitude,
    Latitude,
    Location,
    LastUpdated
  ) %>%
  mutate(
    Longitude = if_else(LocalOffenseCode %in% OffenseTypeLocationFilter$LocalOffenseCode, NA, Longitude),
    Latitude = if_else(LocalOffenseCode %in% OffenseTypeLocationFilter$LocalOffenseCode, NA, Latitude),
    Location = if_else(LocalOffenseCode %in% OffenseTypeLocationFilter$LocalOffenseCode, NA, Location),
  )

# 24 Hr Filter
Offense_Derived_Today <- Offense_Derived %>%
  filter(
    as.Date(TimeDateReported, "%Y-%m-%d", tz = "America/Chicago") == today("America/Chicago") - days(1)
  )

# Write Derived File ------------------------------------------------------
tryCatch({
    dbWriteTable(conn_HazelCrestDerivedTables,
                 "Offense",
                 Offense_Derived,
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