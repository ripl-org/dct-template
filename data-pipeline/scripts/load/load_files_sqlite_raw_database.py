"""
CSV File Processing and Database Loading Module

This module is designed for automated processing and loading of CSV files into an SQLite database. It is particularly
useful in scenarios where raw data extraction results in multiple CSV files that need to be processed and stored in a
structured database format.
"""
from datetime import datetime
import logging
import os
import sys
import yaml

home = os.environ.get('HOME')
script_name = "load_files_sqlite_raw_database"

# Load the YAML configuration file for paths
with open(f'{home}/airflow/config.yaml', 'r') as file:
    config = yaml.safe_load(file)


# Define the directory path for extracted raw files
extracted_csv_dir = os.path.join(home, config['paths']['extracted_csv_dir'])
db_path = os.path.join(home, config['databases']['raw_tables'])
src_path = os.path.join(home, config['paths']['src_dir'])
log_dir = os.path.join(home, config['paths']['logs_dir'], "scripts=load", script_name)

# Dynamically adjust the system path to include the source directory
sys.path.append(os.path.join(os.path.dirname(__file__), src_path))

# Import custom functions for database processing
from src_load_raw_data_sqlite_db import process_csv, get_primary_key, get_table_name

# Check if the directory exists, if not, create it
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
    logging.info(f"Created log directory: {log_dir}")

# Set-up Logging
log_file_name = datetime.now().strftime("%Y%m%dT%H%M%S") + f"__{script_name}.log"
log_file_path = os.path.join(log_dir, log_file_name)
logging.basicConfig(filename=log_file_path,
                    level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    filemode='w'
                    )

# Get a list of all files in the specified directory
export_file_list = os.listdir(os.path.join(home, extracted_csv_dir))

logging.info("Start processing files.")
for file_name in export_file_list:
    file_path = os.path.join(extracted_csv_dir, file_name)

    try:
        # Retrieve primary key and table name for the file
        logging.info("Retrieve primary key and table name for the file")
        primary_key = get_primary_key(file_name)
        table_name = get_table_name(file_name)

        # Check if the file type is supported and process the CSV
        logging.info("Check if the file type is supported and process the CSV")
        if primary_key and table_name:
            process_csv(file_name=file_path, table_name=table_name, primary_key=primary_key, db_path=db_path)
            logging.info(f"Processed CSV: {file_path}, Table Name: {table_name}")
        else:
            # Log a warning for unsupported file types
            logging.warning(f"Unsupported file type: {file_name}")
    except FileNotFoundError:
        # Log an error if the file is not found and continue with the next file
        logging.error(f"File not found: {extracted_csv_dir}/{file_name}")
        continue