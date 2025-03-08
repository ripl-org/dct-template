"""
CSV Data Validation Module

This module is designed to read and validate CSV files extracted from various sources. It is particularly useful in data
processing pipelines where validation of extracted data is crucial before further processing or analysis.

The main functionality of the script is to iterate over all CSV files in the specified directory, read each file into
a pandas DataFrame, and then validate the data using a custom validation function. This process ensures that each CSV
file is checked for data integrity and consistency.
"""
import pandas as pd
import sys
import os
import logging
import yaml
from datetime import datetime

home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

src_path = os.path.join(home, config['paths']['src_dir'])
sys.path.append(os.path.join(os.path.dirname(__file__), src_path))

# import functions from src folder
from src_create_report_raw_data import validate_table

directory_path = os.path.join(home, config['paths']['extracted_csv_dir'])

# Log Path
log_name = os.path.join("scripts=report", "report_create_raw_data_validation_report")
log_dir = os.path.join(home, config['paths']['logs_dir'], log_name)

# Check if the directory exists, if not, create it
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
    logging.info(f"Created log directory: {log_dir}")

# Set-up Logging
log_file_name = datetime.now().strftime("%Y%m%dT%H%M%S") + "__report_create_raw_data_validation_report.log"
log_file_path = os.path.join(log_dir, log_file_name)
logging.basicConfig(filename=log_file_path,
                    level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    filemode='w'
                    )

# Initialize the list to store file names
export_file_list = os.listdir(f'{directory_path}/')

for file_path in export_file_list:
    try:
        logging.info(f"Reading csv file: {file_path}")
        df = pd.read_csv(f'{directory_path}/{file_path}')

        logging.info("Running validate_table function")
        validate_table(dataframe=df, csv=file_path)
    except FileNotFoundError:
        logging.error(f"File not found: {directory_path + file_path}")
        continue
