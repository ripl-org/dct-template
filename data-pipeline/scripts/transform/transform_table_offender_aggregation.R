# Load Libraries ----------------------------------------------------------
library(here)
library(lubridate)
library(stringr)
library(tidyverse)
library(RSQLite)
library(yaml)
library(futile.logger)

home = path.expand("~")
filename = "transform_table_offender_aggregation"

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

# Load Main Data Tables ---------------------------------------------------
flog.info("Loading data tables.")
Offender <- dbReadTable(conn_HazelCrestRawTables, "Offender")
MainNamesTable <- dbReadTable(conn_HazelCrestRawTables, "MainNamesTable")
LawIncidentTable <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentTable")

# Load Lookup Tables ------------------------------------------------------

TableOfRacialCodes <- dbReadTable(conn_HazelCrestRawTables, "TableOfRacialCodes")
TableOfSexCodes <- dbReadTable(conn_HazelCrestRawTables, "TableOfSexCodes")
LawIncidentDispositionCodes <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentDispositionCodes")

# Transform Main Tables & Join LookUp Tables ------------------------------
flog.info("Starting data transformation and joining lookup tables.")
Offender_filtered <- 
  Offender %>%
  select(
    DetailRecordReferenceNumber,
    IncidentReference,
    NameReference
  ) %>%
  filter(grepl("Z", IncidentReference)
         ) %>%
  mutate(
    NameReference = if_else(NameReference == "", NA, NameReference)
  )

LawIncidentTable_filtered <- 
  LawIncidentTable %>%
  select(
    IncidentNumber,
    TimeDateReported,
    Disposition
  ) %>%
  
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
      select(DispositionCode, Disposition_Description=Description), 
    by=c("Disposition"="DispositionCode")
  ) %>%
  mutate(TimeDateReported = as.POSIXct(TimeDateReported, format='%H:%M:%S %m/%d/%Y'),
         DateReported = as.Date(TimeDateReported, "%m/%d/%Y")
         ) %>%
  select(
    IncidentNumber,
    TimeDateReported,
    DateReported,
    IncidentDisposition = Disposition_Description
  )

MainNamesTable_Filtered <- 
  MainNamesTable %>%
  select(
    NameNumber,
    Sex,
    BirthDate,
    RaceCategory
  ) %>%
  left_join(
    TableOfSexCodes,
    by=c("Sex"="CodeAbbrOfSexType")
  ) %>% 
  select(
    -Sex
  ) %>%
  rename(
    Sex=DescriptionOfSexType
  ) %>%
  left_join(
    TableOfRacialCodes,
    by=c("RaceCategory"="CodeAbbrOfRacialType")
  ) %>%
  select(
    -c(RaceCategory, 
    DescriptionOfRacialType)
  ) %>%
  rename(
    Race = UcrActionCode
  ) %>%
  
  mutate(
    Race = str_extract(Race, "^[^,]*"),
    BirthDate = as.Date(BirthDate, "%m/%d/%Y")
  ) %>%
  distinct() %>%
  select(
    NameNumber,
    BirthDate,
    Sex,
    Race
  )

# Join Transformed Main Tables into Single Derived Table ------------------

Offender_Derived <-
  Offender_filtered %>%
  left_join(
    LawIncidentTable_filtered, 
    by=c("IncidentReference"="IncidentNumber")
  ) %>%
  left_join(
    MainNamesTable_Filtered, 
    by=c("NameReference"="NameNumber")
  ) %>%
  mutate(
    Age = floor(as.numeric(DateReported - BirthDate)/365), 
    AgeGroup = case_when(
      is.na(Age) ~ "Not Provided", 
      Age <= 17 ~ "0-17", 
      Age >= 18 & Age <=30 ~ "18-30",
      Age >= 31 & Age <=45 ~ "31-45",
      Age >= 46 & Age <=60 ~ "46-60",
      Age >= 61 ~ "61+", 
      Age == "Unknown" ~ "Unknown",
      TRUE ~ as.character(Age)
    )
  ) %>%
  mutate(
    Race = if_else(
      is.na(Race), "Not Provided", Race
    ), 
    Sex = if_else(
      is.na(Sex), "Not Provided", Sex
    )
  ) %>%
  select(
    DetailRecordReferenceNumber,
    TimeDateReported,
    AgeGroup,
    Race,
    Sex
  ) %>%
  filter(!is.na(TimeDateReported)) %>%
  mutate(year = year(TimeDateReported), 
         month = month(TimeDateReported), 
         YearMonth = paste0(year, "-", month)
  ) %>%
  select(
    -c(
      TimeDateReported, 
      year, 
      month
    )
  )

Offender_AgeCount <- 
  Offender_Derived %>%
  group_by(YearMonth, AgeGroup) %>%
  summarise(
    Count = n()
  ) %>%
  mutate(Percent = round((Count/sum(Count) * 100), 2)
  ) %>%
  rename(
    Variable = AgeGroup
  ) %>%
  mutate(Category = "Age")

Offender_SexCount <- 
  Offender_Derived %>%
  group_by(YearMonth, Sex) %>%
  summarise(
    Count = n()
  ) %>%
  mutate(Percent = round((Count/sum(Count) * 100), 2)
  )  %>%
  rename(
    Variable = Sex
  ) %>%
  mutate(Category = "Sex")

Offender_RaceCount <- 
  Offender_Derived %>%
  group_by(YearMonth, Race) %>%
  summarise(
    Count = n()
  ) %>%
  mutate(Percent = round((Count/sum(Count) * 100), 2)
  )  %>%
  rename(
    Variable = Race
  ) %>%
  mutate(Category = "Race")

OffenderAggregate <-
  bind_rows(
    Offender_AgeCount,
    Offender_RaceCount,
    Offender_SexCount
  ) %>%
  mutate(LastUpdated = as.character(now()))

# Write Derived File ------------------------------------------------------
tryCatch({
    dbWriteTable(conn=conn_HazelCrestDerivedTables,
                 name="OffenderAggregate",
                 value=OffenderAggregate,
                 overwrite=TRUE
                 )
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
