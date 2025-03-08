"""
Data Validation and Reporting Module

This module is designed for the validation and reporting of data processing in a
Python environment, specifically tailored for workflows involving pandas DataFrames.
It reads configuration details from a YAML file, sets up a logging mechanism, and
provides functions to validate data and save validation reports in JSON format.

The module is structured to first read configuration paths for logs and reports
directories from a YAML file. It then configures a logger to write logs to a
specified directory with a timestamped file name. Two primary functions are
defined: `save_report_to_file` and `validate_table`.
"""
import logging
import json
import yaml
import os
from datetime import datetime

home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

# Extracting specific paths from the configuration file for logs and reports directories
reports_dir = os.path.join(home, config['paths']['reports_dir'])

def save_report_to_file(report, directory=os.path.join(reports_dir, "script=validate_tables"), filename="raw_data_validation.json"):
    """
    Saves a given report as a JSON file in a specified directory with a timestamped filename.

    Args:
    report (dict): The report data to be saved.
    directory (str, optional): The directory where the file will be saved. Defaults to "/home/ripl/airflow/logs/extract_validation".
    filename (str, optional): The base name of the file. Defaults to "validation_report.json".
    """
    logging.info("Generating Timestamp String")
    # Generate a timestamp string in the format 'YYYYMMDDTHHMMSS'
    current_datetime = datetime.now().strftime("%Y%m%dT%H%M%S.%f")

    logging.info(f"Generating current datetime to the filename: {current_datetime}")
    # Append the current datetime to the filename
    filename_with_datetime = f"{current_datetime}_{filename}"

    logging.info("Creating the directory if it doesn't exist")
    # Create the directory if it doesn't exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Define the file path
    file_path = os.path.join(directory, filename_with_datetime)

    # report_str = str(report)
    logging.info(f"Writing report to {directory}")
    with open(file_path, 'w') as file:
        json.dump(report, file, indent=4)

def validate_table(dataframe, csv):
    """
    Validates a pandas DataFrame and saves a report about the validation.
    This report includes the table name, current datetime, total rows, and missing values.

    Args:
    dataframe (DataFrame): The DataFrame to be validated.
    csv (str): The name of the table (or CSV file) being validated.
    """
    logging.info("Creating dict")
    validation_report = {}

    logging.info("Appending table name")
    validation_report['table_name'] = csv

    logging.info("Appending datetime")
    validation_report['datetime'] = datetime.now().strftime("%Y/%m/%d %H:%M:%S")

    logging.info("Appending total row count")
    # 1. Row Count
    validation_report['total_rows'] = len(dataframe)

    logging.info("Appending missing row count for each variable")
    # 2. Missing Values
    missing_values = dataframe.isnull().sum()
    missing_values_dict = missing_values.to_dict()
    validation_report['missing_values'] = missing_values_dict

    logging.info("Utalizing save_report_to_file function")
    save_report_to_file(report=validation_report)