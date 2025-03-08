# Load Libraries ----------------------------------------------------------
library(here)
library(lubridate)
library(stringr)
library(tidyverse)
library(RSQLite)
library(yaml)
library(futile.logger)

home = path.expand("~")

# Read in CONFIG File -----------------------------------------------------
flog.info("Loading config file")
config <- yaml.load_file(file.path(home, "airflow", "config.yaml"))

# DB Connection -----------------------------------------------------------
tryCatch({
  conn_HazelCrestDerivedTables <- dbConnect(SQLite(), file.path(home, config$databases$derived_tables))
}, error = function(e) {
  flog.error(paste("Error in database connection:", e$message))
})

# Read CSV ----------------------------------------------------------------

uof <- read_csv("/home/ripl/airflow/data/raw/files/UseOfForce_updated.csv")

uof_updated <- uof %>% mutate(LastUpdated = as.character(LastUpdated),
                        IncidentDate = as.character(as.Date(IncidentDate, '%m/%d/%y')),
                        TimeDateReported = as.character(as.POSIXct(TimeDateReported, format='%m/%d/%y %H:%M'))
                        ) %>%
                        select(-IncidentType) %>%
                        mutate(
                        IncidentDate = if_else(is.na(IncidentDate), "Redacted", IncidentDate),
                        TimeDateReported = if_else(is.na(TimeDateReported), "Redacted", TimeDateReported),
                        )

# uof_timeofday <- uof_updated %>%
#     mutate(
#     TimeOfDay = case_when(
#     lubridate::hour(TimeDateReported) >= 6 & lubridate::hour(TimeDateReported) < 12 ~ "Morning (6AM-12PM)",
#     lubridate::hour(TimeDateReported) >= 12 & lubridate::hour(TimeDateReported) < 18 ~ "Afternoon (12PM-6PM)",
#     lubridate::hour(TimeDateReported) >= 18 ~ "Evening (6PM-12AM)",
#     lubridate::hour(TimeDateReported) < 6 ~ "Late Night (12AM-6AM)",
#     TRUE ~ "Unknown"
#     )) %>%
#     group_by(TimeOfDay) %>%
#     summarise(count = n())

# Uplaod to Derived DB ----------------------------------------------------
tryCatch({
    dbWriteTable(
    conn=conn_HazelCrestDerivedTables,
    name="UseOfForce",
    value=uof_updated,
    overwrite=TRUE
    )
    flog.info("Derived file written to the database.")
}, error = function(e) {
    flog.error(paste("Error in writing derived file:", e$message))
})

# Disconnect from DB ------------------------------------------------------
tryCatch({
    dbDisconnect(conn_HazelCrestDerivedTables)
    flog.info("Database connections closed. Script execution complete.")
}, error = function(e) {
    flog.error(paste("Error in closing database connections:", e$message))
})
