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

# Read in CONFIG File -----------------------------------------------------
config <- yaml.load_file(file.path(home, "airflow", "config.yaml"))

# DB Connection -----------------------------------------------------------
tryCatch({
  conn_HazelCrestDerivedTables <- dbConnect(SQLite(), file.path(home, config$databases$derived_tables))
}, error = function(e) {
  flog.error(paste("Error in database connection:", e$message))
})

CallsForService <- dbReadTable(conn_HazelCrestDerivedTables, "CallsForService")
Offense <- dbReadTable(conn_HazelCrestDerivedTables, "Offense")
TrafficStops <- dbReadTable(conn_HazelCrestDerivedTables, "TrafficStops")


yesterday <- today("America/Chicago") - days(1)
zones = tibble(
    Zone = c("Zone 1", "Zone 2", "Zone 3"),
    )

# Create Table ------------------------------------------------------------

# Calls For Service
json_CallsForService_7days <-
  CallsForService %>%
  filter(Zone != "Other") %>%
  mutate(
    DateReported = as.POSIXct(TimeDateReported, format="%Y-%m-%d")
  ) %>%
  filter(
      DateReported >= yesterday - days(6)
  )  %>%
  group_by(Zone) %>%
  summarise(
    last_7_days_incident_count = n()
  ) %>%
  full_join(zones, by="Zone") %>%
  mutate(
    last_7_days_incident_count = if_else(is.na(last_7_days_incident_count), 0, last_7_days_incident_count),
    category = "calls_for_service"
  )

json_CallsForService_52weeks <-
  CallsForService %>%
  filter(Zone != "Other") %>%
  mutate(
    DateReported = as.POSIXct(TimeDateReported, format="%Y-%m-%d")
  ) %>%
  filter(
    DateReported >= today("America/Chicago") - weeks(52)
  ) %>%
  mutate(Weeks = isoweek(DateReported),
         Year = year(DateReported)
  ) %>%
  group_by(
    Zone, Year, Weeks
  ) %>%
  summarise(
    count = n()
  ) %>%
  ungroup() %>%
  group_by(Zone) %>%
  summarise(
    past_year_weekly_avg_incidents_count = round(mean(count, na.rm = FALSE), digits = 0)
  ) %>%
  full_join(zones, by="Zone") %>%
  mutate(
      past_year_weekly_avg_incidents_count = if_else(is.na(past_year_weekly_avg_incidents_count), 0, past_year_weekly_avg_incidents_count),
      category = "calls_for_service")

json_CallsForService_full <- full_join(json_CallsForService_7days, json_CallsForService_52weeks, by=c("Zone", "category"))

# Traffic TrafficStops
json_TrafficStops_7days <-
  TrafficStops %>%
  filter(Zone != "Other") %>%
  mutate(
    DateReported = as.POSIXct(Occurred, format="%Y-%m-%d")
  ) %>%
  filter(
    DateReported >= yesterday - days(6)
  )  %>%
  group_by(Zone) %>%
  summarise(
    last_7_days_incident_count = n()
  ) %>%
  full_join(zones, by="Zone") %>%
  mutate(
    last_7_days_incident_count = if_else(is.na(last_7_days_incident_count), 0, last_7_days_incident_count),
    category = "traffic_stops"
  )

json_TrafficStops_52weeks <-
  TrafficStops %>%
  filter(Zone != "Other") %>%
  mutate(
    DateReported = as.POSIXct(Occurred, format="%Y-%m-%d")
  ) %>%
  filter(
    DateReported >= yesterday - weeks(52)
  ) %>%
  mutate(Weeks = isoweek(DateReported),
         Year = year(DateReported)
  ) %>%
  group_by(
    Zone, Year, Weeks
  ) %>%
  summarise(
    count = n()
  ) %>%
  ungroup() %>%
  group_by(Zone) %>%
  summarise(
    past_year_weekly_avg_incidents_count = round(mean(count, na.rm = FALSE), digits = 0)
  ) %>%
  full_join(zones, by="Zone") %>%
  mutate(
    past_year_weekly_avg_incidents_count = if_else(is.na(past_year_weekly_avg_incidents_count), 0, past_year_weekly_avg_incidents_count),
    category = "traffic_stops"
  )

json_TrafficStops_full <- full_join(json_TrafficStops_7days, json_TrafficStops_52weeks, by=c("Zone", "category"))


# Offense/crimes
json_Offense_7days <-
  Offense %>%
  filter(Zone != "Other") %>%
  mutate(
    DateReported = as.POSIXct(TimeDateReported, format="%Y-%m-%d")
  ) %>%
  filter(
    DateReported >= yesterday - days(6)
  ) %>%
  group_by(Zone) %>%
  summarise(
    last_7_days_incident_count = n()
  ) %>%
  full_join(zones, by="Zone") %>%
  mutate(
    last_7_days_incident_count = if_else(is.na(last_7_days_incident_count), 0, last_7_days_incident_count),
    category = "crimes"
  )

json_Offense_52weeks <-
  Offense %>%
  filter(Zone != "Other") %>%
  mutate(
    DateReported = as.POSIXct(TimeDateReported, format="%Y-%m-%d")
  ) %>%
  filter(
    DateReported >= yesterday - weeks(52)
  ) %>%
  mutate(Weeks = isoweek(DateReported),
         Year = year(DateReported)
  ) %>%
  group_by(
    Zone, Year, Weeks
  ) %>%
  summarise(
    count = n()
  ) %>%
  ungroup() %>%
  group_by(Zone) %>%
  summarise(
    past_year_weekly_avg_incidents_count = round(mean(count, na.rm = FALSE), digits = 0)
  ) %>%
  full_join(zones, by="Zone") %>%
  mutate(
    past_year_weekly_avg_incidents_count = if_else(is.na(past_year_weekly_avg_incidents_count), 0, past_year_weekly_avg_incidents_count),
    category = "crimes"
  )

json_Offense_full <- full_join(json_Offense_7days, json_Offense_52weeks, by=c("Zone", "category"))

df <- bind_rows(json_Offense_full, json_TrafficStops_full, json_CallsForService_full) %>%
                    select(
                    Zone,
                    category,
                    last_7_days_incidents_count = last_7_days_incident_count,
                    past_year_weekly_avg_incidents_count
                    )

#Write Derived File ------------------------------------------------------
tryCatch({
    dbWriteTable(
    conn=conn_HazelCrestDerivedTables,
    name="LandingPageStats",
    value=df,
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
