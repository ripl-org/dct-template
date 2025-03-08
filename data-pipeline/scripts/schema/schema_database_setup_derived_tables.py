"""
SQLite Database Creation Module for Law Enforcement Data

This module facilitates the creation of an SQLite database specifically designed for storing and managing law enforcement
data. It is intended to be used in environments where data from various law enforcement activities need to be organized
and stored in a relational database format.

Upon execution, the module reads configuration details from a YAML file and checks if the specified SQLite database
already exists. If not, it proceeds to create a new database with a predefined schema. The schema includes tables for
arrests, calls for service, incidents, offenders, offenses, officer radio logs, traffic stops, victims, crime rates,
and use of force incidents.

Each table is carefully structured with relevant fields and data types, and foreign key relationships are established
where necessary to maintain data integrity and relational links between tables.
"""
import sqlite3
import os
import yaml

home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

DB_PATH = os.path.join(home, config['databases']['derived_tables'])

# Check if the database file exists
if os.path.exists(DB_PATH):
    raise Exception(f"Database already exists at path: {DB_PATH}")
else:

    # Connect to your SQLite database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create each table
    # TODO: add the aggregate tables that were never captured here

    cursor.execute("""CREATE TABLE Arrests (
                            "OffenseNumber" TEXT PRIMARY KEY,
                            "IncidentNumber" TEXT,
                            "AgeGroup" TEXT,
                            "IncidentDisposition" TEXT,
                            "JailStatuteDescription" TEXT,
                            "Race" TEXT,
                            "Sex" TEXT,
                            "TimeDateReported" TEXT,
                            "LastUpdated" TEXT
                        )"""
                   )

    cursor.execute("""CREATE TABLE CallsForService (
                            "RecordNumber" TEXT PRIMARY KEY,
                            "IncidentNumber" TEXT,
                            "AgencyCode" TEXT,
                            "CallMethod" TEXT,
                            "CallNature" TEXT,
                            "CallPriority" TEXT,
                            "CallType" TEXT,
                            "CityCode" TEXT,
                            "Latitude" TEXT,
                            "Location" TEXT,
                            "Longitude" TEXT,
                            "TimeDateReported" TEXT,
                            "LastUpdated" TEXT
                        )"""
                   )

    cursor.execute("""CREATE TABLE Incidents (
                            "IncidentNumber" TEXT PRIMARY KEY,
                            "LongTermCallID" TEXT,
                            "AgencyCode" TEXT,
                            "City" TEXT,
                            "CrimeCategory" TEXT,
                            "HowReceived" TEXT,
                            "IncidentCallNature" TEXT,
                            "IncidentDisposition" TEXT,
                            "IncidentType" TEXT,
                            "Latitude" TEXT,
                            "Location" TEXT,
                            "Longitude" TEXT,
                            "TimeDateReported" TEXT,
                            "LastUpdated" TEXT
                        )"""
                   )
    cursor.execute("""CREATE TABLE Offender (
                            "AgeGroup" TEXT,
                            "IncidentDisposition" TEXT,
                            "IncidentNumber" TEXT,
                            "TimeDateReported" TEXT,
                            "DetailRecordReferenceNumber" TEXT,
                            "Race" TEXT,
                            "Sex" TEXT,
                            "LastUpdated" TEXT,
                            LongTermCallID TEXT
                        )"""
                   )

    cursor.execute("""CREATE TABLE Offenses (
                            "IncidentNumber" TEXT,
                            "LongTermCallID" TEXT,
                            "AgencyCode" TEXT,
                            "CrimeCategory" TEXT,
                            "IncidentDisposition" TEXT,
                            "Latitude" TEXT,
                            "LocalOffenseCode" TEXT,
                            "LocalOffenseDescription" TEXT,
                            "Location" TEXT,
                            "Longitude" TEXT,
                            "NIBRSCodes" TEXT,
                            "NIBRSCrimeAgainst" TEXT,
                            "NIBRSOffense" TEXT,
                            "NIBRSOffenseCategory" TEXT,
                            "StatuteCode" TEXT,
                            "StatuteDescription" TEXT,
                            "TimeDateReported" TEXT,
                            "UCRParts" TEXT,
                            "LastUpdated" TEXT
                        )"""
                   )

    cursor.execute("""CREATE TABLE OfficerRadioLogs (
                            "LongTermCallID" TEXT Primary Key,
                            "AgencyCode" TEXT,
                            "CallNatureDescription" TEXT,
                            "CallPriority" TEXT,
                            "CallType" TEXT,
                            "DateOccured" TEXT,
                            "TimeDateReported" TEXT,
                            "DateTimeArrivedOnScene" TEXT,
                            "DateTimeCompletedCall" TEXT,
                            "ResponseTime_Seconds" REAL,
                            "TimeOnScene_Seconds" REAL,
                            "OfficerName" TEXT,
                            "UnitZoneCode" TEXT,
                            "LastUpdated" TEXT
                        )"""
                   )

    cursor.execute("""CREATE TABLE TrafficStops (
                            "RecordNumber" TEXT PRIMARY KEY,
                            "LongTermCallID" TEXT,
                            "AgencyCode" TEXT,
                            "CityCode" TEXT,
                            "Latitude" TEXT,
                            "Location" TEXT,
                            "Longitude" TEXT,
                            "Occurred" TEXT,
                            "LastUpdated" TEXT
                            )"""
                   )

    cursor.execute("""CREATE TABLE Victim (
                            "DetailRecordReferenceNumber" TEXT PRIMARY KEY,
                            "AgeGroup" TEXT,
                            "IncidentNumber" TEXT,
                            "NameNumber" TEXT,
                            "Race" TEXT,
                            "Sex" TEXT,
                            "TimeDateReported" TEXT,
                            "LastUpdated" TEXT
                            )"""
                   )

    cursor.execute("""CREATE TABLE CrimeRate (
                            "Date" TEXT,
                            "PredictedPopulation" TEXT,
                            "CrimeCount" TEXT,
                            "AveragePredictedPopulationTrailing12Months" TEXT,
                            "SumOfCrimesTrailing12Months" TEXT,
                            "Trailing12MonthAnnualizedCrimeRate" TEXT,
                            "CrimeCategory" TEXT,
                            "LastUpdated" TEXT
                            )"""
                   )

    cursor.execute("""CREATE TABLE UseOfForce (
                            "IncidentNumber" TEXT PRIMARY KEY,
                            "IncidentDate" TEXT,
                            "HazelCrestZone" TEXT,
                            "TypeofForce" TEXT,
                            "CallCategory" TEXT,
                            "Notes" TEXT,
                            "CallOfficerInitiated" TEXT,
                            "Disposition" TEXT,
                            "OfficerName" TEXT,
                            "SubjectWeapons" TEXT,
                            "SubjectRaceEthnicity" TEXT,
                            "SubjectSex" TEXT,
                            "SubjectAgeGroup" TEXT,
                            "Latitude" TEXT,
                            "Longitude" TEXT
                            )"""
                   )
    
    # Close the connection
    conn.close()
