# Load Libraries ----------------------------------------------------------
library(tidyverse)
library(here)
library(zoo)
library(lubridate)
library(stringr)
library(RSQLite)
library(yaml)
library(futile.logger)

home = path.expand("~")
filename = "transform_table_crime_rate"

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
LawIncidentOffensesDetail <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentOffensesDetail")
LawIncidentTable <- dbReadTable(conn_HazelCrestRawTables, "LawIncidentTable")

tdflit <- LawIncidentTable %>%
    mutate(DateObj = as.POSIXct(TimeDateReported, format='%H:%M:%S %m/%d/%Y')) %>%
    mutate(Year = as.Date(DateObj, "%Y")) %>%
    select(IncidentNumber,TimeDateReported,DateObj) %>%
    filter(DateObj > "2024-04-15")

# LookUp Tables -----------------------------------------------------------
OffenseCodes <- dbReadTable(conn_HazelCrestRawTables, "OffenseCodes")

# Aggregation Files --------------------------------------------------------
LocalOffenseDescriptionToNIBRSCodes <- dbReadTable(conn_HazelCrestRawTables, "LocalOffenseDescriptionToNIBRSCodes")
NIBRSOffenseCodes <- dbReadTable(conn_HazelCrestRawTables, "NIBRSOffenseCodes")

# Load Calculated Files ---------------------------------------------------

PredictedMonthlyPopulation <- read_csv("/home/ripl/airflow/data/static/hazel_crest_il_lm_predicted_population_08_23.csv")

# Transform Main File ---------------------------------------------------------
flog.info("Starting data transformation and joining lookup tables.")
LawIncidentOffensesDetail_filtered <-
  LawIncidentOffensesDetail %>%
  filter(grepl("Z|z", IncidentNumber)
  ) %>%
  # Join Offense Codes to get LocalOffenseDescription Column
  select(
    IncidentNumber,
    LocalOffenseCode = OffenseCode
  ) %>%
  left_join(
    OffenseCodes %>%
      select(
        CodeForOffense,
        LocalOffenseDescription = OffenseDescription
      ),
    by=c("LocalOffenseCode" = "CodeForOffense")
  ) %>%
  # Join Local Offense Description to NIBRS Codes
  left_join(
    LocalOffenseDescriptionToNIBRSCodes,
    by=c("LocalOffenseDescription")
  ) %>%
  left_join(
    NIBRSOffenseCodes,
    by=c("NIBRSCode" = "NIBRSOffenseCode")
  ) %>%
  select(
    IncidentNumber,
    LocalOffenseDescription,
    NIBRSCode,
    CrimeCategory
  )

LawIncidentTable_Filtered <-
  LawIncidentTable %>%
  select(
    IncidentNumber,
    TimeDateReported,
  ) %>%
  mutate(TimeDateReported = as.POSIXct(TimeDateReported, format='%H:%M:%S %m/%d/%Y'),
         DateReported = as.Date(TimeDateReported, "%m/%d/%Y"),
         Year = as.Date(TimeDateReported, "%Y")
         ) %>%
  select(
    IncidentNumber,
    DateReported,
    Year
  )

tdflitf = LawIncidentTable_Filtered %>%
    filter(DateReported > "2024-04-15")
print(tdflitf)

PredictedMonthlyPopulation <-
  PredictedMonthlyPopulation %>%
  mutate(Date = ymd(date),
         year = year(Date),
         month = month(Date))


# Create CrimeRate Dataset ------------------------------------------------
crime_data <-
  LawIncidentOffensesDetail_filtered %>%
  left_join(LawIncidentTable_Filtered,
            by=c("IncidentNumber")
            ) %>%
  # Filter out rows in offense dataset that do not have NIBRS Code
  # The assumption here is that these entries are not actual crimes.
  filter(!is.na(NIBRSCode)) %>%
  mutate(month = month(DateReported),
         year = year(DateReported)
         ) %>%
  filter(year >= 2009) %>%
  group_by(year, month,) %>%
  summarise(crime_count = n()) %>%
  mutate(month_year = paste0(year, ".", month))

crime_data_by_category <-
  LawIncidentOffensesDetail_filtered %>%
  left_join(LawIncidentTable_Filtered,
            by=c("IncidentNumber")
  ) %>%
  filter(!is.na(NIBRSCode)) %>%
  mutate(month = month(DateReported),
         year = year(DateReported)
  ) %>%
  filter(year >= 2009) %>%
  group_by(year, month, CrimeCategory) %>%
  summarise(crime_count = n()) %>%
  mutate(month_year = paste0(year, ".", month))

# Crime Rate: Overall -----------------------------------------------------
trialing_12month_annualized_cr_all <- crime_data %>%
  left_join(PredictedMonthlyPopulation, by = c("year", "month")) %>%
  ungroup() %>%
  arrange(Date) %>%
  mutate(avg_predicted_pop_trailing_12_month = zoo::rollapply(predicted_population, align = "right", 12, mean, fill = NA),
         sum_of_crimes_trailing_12_month = zoo::rollapply(crime_count, 12, sum, align = "right", fill = NA)
  ) %>%
  mutate(
    trailing_12_month_annualized_crime_rate = (sum_of_crimes_trailing_12_month / avg_predicted_pop_trailing_12_month)*1000
  ) %>%
  select(date = Date,
         predicted_population,
         crime_count,
         avg_predicted_pop_trailing_12_month,
         sum_of_crimes_trailing_12_month,
         trailing_12_month_annualized_crime_rate
  ) %>%
  filter(!is.na(trailing_12_month_annualized_crime_rate)) %>%
  mutate(CrimeCategory = "All Offenses")


# CrimeRate by Category ---------------------------------------------------
trialing_12month_annualized_cr_by_category_DisorderlyConduct <-
  crime_data_by_category %>%
  left_join(PredictedMonthlyPopulation, by = c("year", "month")) %>%
  ungroup() %>%
  filter(CrimeCategory=="Disorderly Conduct") %>%
  mutate(date = as.Date(Date, "%Y-%m-%d")) %>%
  arrange(date) %>%
  mutate(avg_predicted_pop_trailing_12_month = zoo::rollapply(predicted_population, align = "right", 12, mean, fill = NA),
         sum_of_crimes_trailing_12_month = zoo::rollapply(crime_count, 12, sum, align = "right", fill = NA)
  ) %>%
  mutate(
    trailing_12_month_annualized_crime_rate = (sum_of_crimes_trailing_12_month / avg_predicted_pop_trailing_12_month)*1000
  ) %>%
  select(date = Date,
         CrimeCategory,
         predicted_population,
         crime_count,
         avg_predicted_pop_trailing_12_month,
         sum_of_crimes_trailing_12_month,
         trailing_12_month_annualized_crime_rate
  ) %>%
  filter(!is.na(trailing_12_month_annualized_crime_rate)
         )

trialing_12month_annualized_cr_by_category_FinancialCrimes <-
  crime_data_by_category %>%
  left_join(PredictedMonthlyPopulation, by = c("year", "month")) %>%
  ungroup() %>%
  filter(CrimeCategory=="Financial Crimes") %>%
  group_by(CrimeCategory) %>%
  mutate(date = as.Date(Date, "%Y-%m-%d")) %>%
  arrange(date) %>%
  mutate(avg_predicted_pop_trailing_12_month = zoo::rollapply(predicted_population, align = "right", 12, mean, fill = NA),
         sum_of_crimes_trailing_12_month = zoo::rollapply(crime_count, 12, sum, align = "right", fill = NA)
  ) %>%
  mutate(
    trailing_12_month_annualized_crime_rate = (sum_of_crimes_trailing_12_month / avg_predicted_pop_trailing_12_month)*1000
  ) %>%
  select(date = Date,
         CrimeCategory,
         predicted_population,
         crime_count,
         avg_predicted_pop_trailing_12_month,
         sum_of_crimes_trailing_12_month,
         trailing_12_month_annualized_crime_rate
  ) %>%
  filter(!is.na(trailing_12_month_annualized_crime_rate))

trialing_12month_annualized_cr_by_category_OtherCrimes <-
  crime_data_by_category %>%
  left_join(PredictedMonthlyPopulation, by = c("year", "month")) %>%
  ungroup() %>%
  filter(CrimeCategory=="Other Crimes") %>%
  mutate(date = as.Date(Date, "%Y-%m-%d")) %>%
  arrange(date) %>%
  mutate(avg_predicted_pop_trailing_12_month = zoo::rollapply(predicted_population, align = "right", 12, mean, fill = NA),
         sum_of_crimes_trailing_12_month = zoo::rollapply(crime_count, 12, sum, align = "right", fill = NA)
  ) %>%
  mutate(
    trailing_12_month_annualized_crime_rate = (sum_of_crimes_trailing_12_month / avg_predicted_pop_trailing_12_month)*1000
  ) %>%
  select(date = Date,
         CrimeCategory,
         predicted_population,
         crime_count,
         avg_predicted_pop_trailing_12_month,
         sum_of_crimes_trailing_12_month,
         trailing_12_month_annualized_crime_rate
  ) %>%
  filter(!is.na(trailing_12_month_annualized_crime_rate))

trialing_12month_annualized_cr_by_category_PhysicalorSexualViolence <-
  crime_data_by_category %>%
  left_join(PredictedMonthlyPopulation, by = c("year", "month")) %>%
  ungroup() %>%
  filter(CrimeCategory=="Physical or Sexual Violence") %>%
  group_by(CrimeCategory) %>%
  mutate(date = as.Date(Date, "%Y-%m-%d")) %>%
  arrange(date) %>%
  mutate(avg_predicted_pop_trailing_12_month = zoo::rollapply(predicted_population, align = "right", 12, mean, fill = NA),
         sum_of_crimes_trailing_12_month = zoo::rollapply(crime_count, 12, sum, align = "right", fill = NA)
  ) %>%
  mutate(
    trailing_12_month_annualized_crime_rate = (sum_of_crimes_trailing_12_month / avg_predicted_pop_trailing_12_month)*1000
  ) %>%
  select(date = Date,
         CrimeCategory,
         predicted_population,
         crime_count,
         avg_predicted_pop_trailing_12_month,
         sum_of_crimes_trailing_12_month,
         trailing_12_month_annualized_crime_rate
  ) %>%
  filter(!is.na(trailing_12_month_annualized_crime_rate))

trialing_12month_annualized_cr_by_category_PropertyandTheftRelatedCrimes <-
  crime_data_by_category %>%
  left_join(PredictedMonthlyPopulation, by = c("year", "month")) %>%
  ungroup() %>%
  filter(CrimeCategory=="Property and Theft-Related Crimes") %>%
  mutate(date = as.Date(Date, "%Y-%m-%d")) %>%
  arrange(date) %>%
  mutate(avg_predicted_pop_trailing_12_month = zoo::rollapply(predicted_population, align = "right", 12, mean, fill = NA),
         sum_of_crimes_trailing_12_month = zoo::rollapply(crime_count, 12, sum, align = "right", fill = NA)
  ) %>%
  mutate(
    trailing_12_month_annualized_crime_rate = (sum_of_crimes_trailing_12_month / avg_predicted_pop_trailing_12_month)*1000
  ) %>%
  select(date = Date,
         CrimeCategory,
         predicted_population,
         crime_count,
         avg_predicted_pop_trailing_12_month,
         sum_of_crimes_trailing_12_month,
         trailing_12_month_annualized_crime_rate
  ) %>%
  filter(!is.na(trailing_12_month_annualized_crime_rate))

trialing_12month_annualized_cr_by_category_SubstanceRelatedCrimes <-
  crime_data_by_category %>%
  left_join(PredictedMonthlyPopulation, by = c("year", "month")) %>%
  ungroup() %>%
  filter(CrimeCategory=="Substance-Related Crimes") %>%
  mutate(date = as.Date(Date, "%Y-%m-%d")) %>%
  arrange(date) %>%
  mutate(avg_predicted_pop_trailing_12_month = zoo::rollapply(predicted_population, align = "right", 12, mean, fill = NA),
         sum_of_crimes_trailing_12_month = zoo::rollapply(crime_count, 12, sum, align = "right", fill = NA)
  ) %>%
  mutate(
    trailing_12_month_annualized_crime_rate = (sum_of_crimes_trailing_12_month / avg_predicted_pop_trailing_12_month)*1000
  ) %>%
  select(date = Date,
         CrimeCategory,
         predicted_population,
         crime_count,
         avg_predicted_pop_trailing_12_month,
         sum_of_crimes_trailing_12_month,
         trailing_12_month_annualized_crime_rate
  ) %>%
  filter(!is.na(trailing_12_month_annualized_crime_rate))

# Combine All CrimeRate Files ---------------------------------------------
Trailing12MonthAnnualizedCrimeRate <-
  bind_rows(
    trialing_12month_annualized_cr_all,
    trialing_12month_annualized_cr_by_category_DisorderlyConduct,
    trialing_12month_annualized_cr_by_category_FinancialCrimes,
    trialing_12month_annualized_cr_by_category_OtherCrimes,
    trialing_12month_annualized_cr_by_category_PhysicalorSexualViolence,
    trialing_12month_annualized_cr_by_category_PropertyandTheftRelatedCrimes,
    trialing_12month_annualized_cr_by_category_SubstanceRelatedCrimes
  ) %>%
  mutate(trailing_12_month_annualized_crime_rate = as.numeric(trailing_12_month_annualized_crime_rate),
         LastUpdated = as.character(now()),
         date = as.character(date)
         ) %>%
  select(
    Date = date,
    Trailing12MonthAnnualizedCrimeRate = trailing_12_month_annualized_crime_rate,
    CrimeCategory,
    LastUpdated
  )

# Write Derived File ------------------------------------------------------
tryCatch({
    dbWriteTable(conn=conn_HazelCrestDerivedTables,
                 name="Trailing12MonthAnnualizedCrimeRate",
                 value=Trailing12MonthAnnualizedCrimeRate,
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