"""
CSV to SQLite Database Loader Module

This module provides functionalities for processing CSV files and inserting their data into an SQLite database. It is
equipped to handle various tables and CSV file formats, making it versatile for different data ingestion scenarios.


Functions:
- create_upsert_query(table_name, columns, primary_key): Creates a SQL UPSERT (insert or update) query for a given table, columns, and primary key.
- process_csv(file_name, table_name, primary_key, db_path): Processes a CSV file and inserts its data into an SQLite database.
- get_primary_key(file_name): Determines the primary key(s) for a table based on the CSV file name.
- get_table_name(file_name): Retrieves the table name based on a given file name.


Note:
    This module is designed with the assumption that the CSV files follow a specific naming convention that corresponds
    to the database schema. Modifications may be required to match different naming conventions or database structures.
"""
import csv
import sqlite3
import logging
import yaml
import os
from datetime import datetime

home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

# Function to create dynamic insert query based on CSV headers
def create_upsert_query(table_name, columns, primary_key):
    """
    Creates a SQL UPSERT (insert or update) query for a given table, columns, and primary key.

    Parameters:
    table_name (str): The name of the SQLite table.
    columns (list): A list of column names for the table.
    primary_key (str or list): The primary key of the table, either a single column name or a list for composite keys.

    Returns:
    str: A SQL UPSERT query string.
    """
    try:
        logging.info(f"Creating UPSERT query for table: {table_name}")
        # Formatting column names and placeholders for the query
        column_names = ', '.join([f'"{column}"' for column in columns])
        placeholders = ', '.join(['?'] * len(columns))

        # Handling the conflict resolution part of the query based on the primary key
        if isinstance(primary_key, list):
            conflict_target = ', '.join([f'"{pk}"' for pk in primary_key])
        else:
            conflict_target = f'"{primary_key}"'

        update_columns = [f'"{column}" = excluded."{column}"' for column in columns if column != primary_key]

        # Constructing and returning the complete SQL UPSERT query
        upsert_query = f"""
            INSERT INTO {table_name} ({column_names})
            VALUES ({placeholders})
            ON CONFLICT ({conflict_target})
            DO UPDATE SET {', '.join(update_columns)}"""

        logging.info(f"Generated UPSERT query: {upsert_query}")
        return upsert_query
    except Exception as e:
        logging.error(f"Error in create_upsert_query for table {table_name}: {e}")
        raise


# Function to process the CSV file and insert data into the database
def process_csv(file_name, table_name, primary_key, db_path):
    """
    Processes a CSV file and inserts its data into an SQLite database.

    Parameters:
    file_name (str): Path to the CSV file.
    table_name (str): Name of the SQLite table to insert data into.
    primary_key (str or list): Primary key of the table.
    db_path (str): Path to the SQLite database file.
    """
    try:
        logging.info(f"Processing CSV file: {file_name}")

        with open(file_name, 'r') as file:
            reader = csv.reader(file)
            headers = next(reader)  # Get the first row which is the header
            logging.info("CSV file opened and headers read.")

            # Connect to the SQLite database
            connection = sqlite3.connect(db_path)
            cursor = connection.cursor()
            logging.info("Database connection established.")

            # Create dynamic insert query
            upsert_query = create_upsert_query(table_name, headers, primary_key)

            # Initialize a counter for successful inserts
            successful_inserts = 0

            # Insert each row from the CSV into the database one by one
            for row in reader:
                try:
                    cursor.execute(upsert_query, row)
                    connection.commit()  # Commit after each successful insert
                    successful_inserts += 1
                    logging.info(f"Row inserted successfully: {row}")
                except Exception as e:
                    logging.error(f"Error inserting row {row}: {e}")

            connection.close()
            logging.info("Database connection closed.")

            logging.info(f"Total number of rows successfully inserted: {successful_inserts}")

        logging.info(f"Successfully processed and inserted data from {file_name} into {table_name}")
    except Exception as e:
        logging.error(f"Error processing CSV file {file_name}: {e}")
        raise

def get_primary_key(file_name):
    """
    Determines the primary key(s) for a table based on the CSV file name.

    Parameters:
    file_name (str): The name of the CSV file.

    Returns:
    str or list: The primary key(s) of the table corresponding to the file name.
    """
    # Mapping file names to their respective primary keys
    # Each 'if' condition checks if the file name matches a certain pattern and returns the corresponding primary key
    # This function needs to be tailored to match the specific file naming conventions and database schema
    try:
        if "LawIncidentTable_main" in file_name:
            return "IncidentNumber"
        elif "LawIncidentOffensesDetail" in file_name:
            return ["IncidentNumber", "StatuteCode", "OffenseCode", "SequenceNumber"]
        elif "CADMasterCallTable" in file_name:
            return "RecordNumber"
        elif "GeobaseAddressIDMaintenance" in file_name:
            return "IDNumberOfAddress"
        elif "OfficerRadioLogTable" in file_name:
            return ["LongTermCallID", "OfficerName", "UnitStatus", "TimeOfStatusChange"]
        elif "CADTrafficStopTable" in file_name:
            return "RecordNumber"
        elif "MasterCitationTable" in file_name:
            return "CitationNumber"
        elif "MainNamesTable" in file_name:
            return "NameNumber"
        elif "JailOffenseTable" in file_name:
            return "OffenseNumber"
        elif "Offender" in file_name:
            return "DetailRecordReferenceNumber"
        elif "Victim" in file_name:
            return "DetailRecordReferenceNumber"
        elif "TableOfInvolvements" in file_name:
            return ["DateInvolvementOccurred", "RecIDThisRecordsIDNo", "RelIDRelatedRecordsID", "RecordSecurityID", "TypeOfThisRecord"]
        elif "TrafficWarningTable" in file_name:
            return "TrafficWarningNumber"
        elif "TrafficWarningOffenseDetail" in file_name:
            return "TrafficWarningNumber"
        elif "JailInmateTable" in file_name:
            return "Number"
        else:
            logging.warning(f"No matching primary key found for file {file_name}")
            return None
    except Exception as e:
        logging.error(f"Error in get_primary_key for file {file_name}: {e}")
        raise

def get_table_name(file_name):
    """
    Retrieve the table name based on a given file name.

    This function maps a file name to its corresponding table name in a database. It checks the file name
    against a predefined list of patterns, each associated with a specific table name.

    Parameters:
    file_name (str): The name of the file for which the corresponding table name is to be determined.

    Returns:
    str: The name of the table that corresponds to the given file name. If the file name does not match any
         predefined pattern, the function returns None.
    """
    try:
        logging.info(f"Retrieving table name for file: {file_name}")
        if "LawIncidentTable" in file_name:
            return "LawIncidentTable"
        elif "LawIncidentOffensesDetail" in file_name:
            return "LawIncidentOffensesDetail"
        elif "CADMasterCallTable" in file_name:
            return "CADMasterCallTable"
        elif "GeobaseAddressIDMaintenance" in file_name:
            return "GeobaseAddressIDMaintenance"
        elif "OfficerRadioLogTable" in file_name:
            return "OfficerRadioLogTable"
        elif "CADTrafficStopTable" in file_name:
            return "CADTrafficStopTable"
        elif "MasterCitationTable" in file_name:
            return "MasterCitationTable"
        elif "MainNamesTable" in file_name:
            return "MainNamesTable"
        elif "JailOffenseTable" in file_name:
            return "JailOffenseTable"
        elif "Offender" in file_name:
            return "Offender"  # Assuming the table name
        elif "Victim" in file_name:
            return "Victim"  # Assuming the table name
        elif "TableOfInvolvements" in file_name:
            return "TableOfInvolvements"
        elif "TrafficWarningTable" in file_name:
            return "TrafficWarningTable"
        elif "TrafficWarningOffenseDetail" in file_name:
            return "TrafficWarningOffenseDetail"
        elif "JailInmateTable" in file_name:
            return "JailInmateTable"
        else:
            logging.warning(f"No matching table name found for file {file_name}")
            return None
    except Exception as e:
        logging.error(f"Error in get_table_name for file {file_name}: {e}")
        raise