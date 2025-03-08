# Load Libraries ----------------------------------------------------------
library(here)
library(lubridate)
library(stringr)
library(tidyverse)
library(RSQLite)
library(yaml)
library(futile.logger)
library(tools)

home = path.expand("~")
filename = "transform_table_arrests_aggregation"

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
LawIncidentTable <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentTable")
MainNamesTable <- dbReadTable(conn_HazelCrestRawTables, "MainNamesTable")
JailOffenseTable <- dbReadTable(conn_HazelCrestRawTables, "JailOffenseTable")
JailInmateTable <- dbReadTable(conn_HazelCrestRawTables, "JailInmateTable")

# LookUp Tables -----------------------------------------------------------
OffenseCodes <- dbReadTable(conn_HazelCrestRawTables, "OffenseCodes")
StatuteCodesTable <- dbReadTable(conn_HazelCrestRawTables, "StatuteCodesTable")
CitationTypeCodes <- dbReadTable(conn_HazelCrestRawTables, "CitationTypeCodes")
LawIncidentDispositionCodes <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentDispositionCodes")
TableOfRacialCodes <- dbReadTable(conn_HazelCrestRawTables, "TableOfRacialCodes")
TableOfSexCodes <- dbReadTable(conn_HazelCrestRawTables, "TableOfSexCodes")

# Transform Main Tables & Join LookUp Tables ------------------------------
flog.info("Starting data transformation and joining lookup tables.")
LawIncidentTable_Filtered <-
  LawIncidentTable %>%
  mutate(across(everything(), ~ifelse(nchar(trimws(.)) == 0, NA, .))) %>%
  select(
    IncidentNumber,
    Disposition,
    TimeDateOccurredAfter,
    TimeDateReported
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
    TimeDateOccurredAfter,
    Disposition = Description
  ) %>%
  distinct()

MainNamesTable_Filtered <-
  MainNamesTable %>%
  mutate(across(everything(), ~ifelse(nchar(trimws(.)) == 0, NA, .))) %>%
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
  left_join(
    TableOfRacialCodes,
    by=c("RaceCategory"="CodeAbbrOfRacialType")
  ) %>%

  select(
    -c(
      Sex,
      RaceCategory,
      DescriptionOfRacialType
    )
  ) %>%
  rename(
    Sex = DescriptionOfSexType,
    Race = UcrActionCode
  ) %>%

  mutate(
    Race = str_extract(Race, "^[^,]*"),
    BirthDate = as.Date(BirthDate, "%m/%d/%Y")
  ) %>%
  distinct()

JailOffenseTable_Filtered <-
  JailOffenseTable %>%
  mutate(across(everything(), ~ifelse(nchar(trimws(.)) == 0, NA, .))) %>%
  select(
    OffenseNumber,
    LawIncidentNumber,
    InmateNumber,
    OffenseCode,
    Statute,
    TimeDate
  ) %>%

  left_join(
    OffenseCodes %>%
      select(
        CodeForOffense,
        OffenseDescription
      ),
    by=c("OffenseCode"="CodeForOffense")
  ) %>%

  left_join(
    StatuteCodesTable %>%
      select(StatuteCode, Description),
    by=c("Statute"="StatuteCode")
  ) %>%
  rename(
    StatuteDescription = Description
  ) %>%
  select(
    LawIncidentNumber,
    InmateNumber,
    TimeDate
  ) %>%
  distinct()

JailInmateTable_Filtered <- JailInmateTable %>%
  mutate(across(everything(), ~ifelse(nchar(trimws(.)) == 0, NA, .))) %>%
  select(Number, NameNumber)

# Join Transformed Main Tables into Single Derived Table ------------------

arrests <- JailOffenseTable_Filtered %>%
  left_join(JailInmateTable_Filtered,
            by=c("InmateNumber"="Number")
            ) %>%
  left_join(
    LawIncidentTable_Filtered,
    by=c("LawIncidentNumber"="IncidentNumber")
  ) %>%
  left_join(
    MainNamesTable_Filtered,
    by=c("NameNumber")
  ) %>%
  mutate(
    TimeDate = if_else(is.na(TimeDate), TimeDateOccurredAfter, TimeDate),
    TimeDate = as.POSIXct(TimeDate, format='%H:%M:%S %m/%d/%Y'),
    DateReported = as.Date(TimeDate, "%m/%d/%Y"),
    BirthDate = as.Date(BirthDate, "%Y-%m-%d"),
    Age = floor(as.numeric(DateReported - BirthDate)/365),
    AgeGroup = case_when(
      is.na(Age) ~ "Not Provided",
      Age <= 17 ~ "Under 18",
      Age >= 18 ~ "Over 18",
      Age == "Unknown" ~ "Unknown",
      TRUE ~ as.character(Age)
    ),
    Race = if_else(
      is.na(Race), "Not Provided", Race
    ),
    Sex = if_else(
      is.na(Sex), "Not Provided", Sex
    )
  ) %>%
  select(
    InmateNumber,
    TimeDate,
    AgeGroup,
    Sex,
    Race
  ) %>%
  mutate(YearMonth = floor_date(TimeDate, "month")
         )

arrests_long <- arrests %>%
  pivot_longer(cols = AgeGroup:Race,
               names_to = "variable",
               values_to = "category"
               )

tdfa <- arrests %>%
    filter(YearMonth > "2024-02-01")
print(tdfa)
# calculate count and percent of all provided cats
ArrestsAggregate <- arrests_long %>%
  group_by(YearMonth, variable, category) %>%
  summarise(
    Count = n()
  ) %>%
  mutate(Percent = round((Count/sum(Count) * 100), 2),
         YearMonth = as.character(YearMonth),
         LastUpdated = as.character(now())
         ) %>%
  select(
    YearMonth,
    Variable = variable,
    Category = category,
    Count,
    Percent,
    LastUpdated
  )

# Write Derived File ------------------------------------------------------
tryCatch({
  dbWriteTable(conn_HazelCrestDerivedTables,
               "ArrestsAggregate",
               ArrestsAggregate,
               overwrite=TRUE)
  flog.info("Derived file written to the database")
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


