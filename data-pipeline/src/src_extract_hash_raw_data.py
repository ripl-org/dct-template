"""
Data Processing and Hashing Module

This module offers functionality for parsing XML files, hashing data, and processing
data stored in pandas DataFrames. It is designed for workflows that require reading
configuration details from a YAML file, parsing XML data into DataFrames, and applying
hashing to specific columns of the DataFrame.

The module starts by reading configuration paths from a YAML file. It then defines
functions to parse XML files into DataFrames, generate salted hashes, and hash specified
columns in a DataFrame before saving the result as a CSV file.

Note:
    This module assumes the presence of a valid YAML configuration file and a writable
    file system for saving output files. Modifications may be needed for different file
    formats or data structures.
"""
import hashlib
import logging
import pandas as pd
import yaml
import logging
import os

home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)


def parse_xml(text_file, table_name):
    """
    Parses an XML file and returns a DataFrame of a specified table.

    Parameters:
    text_file (str): The path to the XML file.
    table_name (str): The name of the table to parse from the XML.

    Returns:
    DataFrame: A pandas DataFrame containing the parsed table data.
    """
    try:
        logging.info(f"Parsing XML file: {table_name}")
        data_frame0 = pd.read_xml(text_file, xpath=f".//{table_name}")

        logging.info(f"Successfully parsed table {table_name} with shape {data_frame0.shape}")
        return data_frame0

    except Exception as e:
        logging.exception(f"Error occurred while parsing {table_name}: {e}")

        # Exit the script if an exception occurs
        return None

def salted_hash(value, salt=None):
    """
    Generate a SHA-1 hash for a given value, optionally using a salt.

    This function creates a SHA-1 hash for the provided value. If a salt is provided, it is appended to
    the value before hashing. The function is designed to handle 'None' values, which represent missing
    data. In such cases, it returns a specific value to indicate the absence of data.

    Parameters:
    value (str): The value to be hashed. If this value is a string 'None', it is treated as missing data.
    salt (str, optional): An optional string to be appended to the value before hashing. Defaults to None.

    Returns:
    str or None: The SHA-1 hash of the value, or None/an indicator if the input value represents missing data.
    """
    # Check if the value is missing (None in pandas)
    try:
        logging.debug("Entering salted_hash function.")
        if value == "None":
            # Return a specific value to indicate missing data
            logging.debug("Handling missing Value (None value).")
            return None  # Or return 'missing', or any other indicator you prefer

        # Your existing hashing logic
        if salt is None:
            logging.debug("Hashing without salt.")
            k = value.encode("utf-8")
        else:
            logging.debug("Hashing with salt.")
            k = (value + salt).encode("utf-8")
        return hashlib.sha1(k).hexdigest()
    except Exception as e:
        logging.error(f"Error in salted_hash function: {e}")
        return None

# Function to hash columns in a CSV file
def hash_columns(data_frame, output_file, output_directory, columns_to_hash, salt=None):
    """
    Hashes specified columns in a DataFrame and saves it as a CSV file.

    Parameters:
    data_frame (DataFrame): DataFrame to be processed.
    output_file (str): Name of the output CSV file.
    output_directory (str): Directory for saving the output file.
    columns_to_hash (list): List of column names to hash.
    salt (str, optional): Salt for hashing. Default is None.
    """
    try:
        # Read the CSV file into a DataFrame
        df = data_frame

        # Apply the salted_hash function to the specified columns
        for column in columns_to_hash:
            # Check if the column exists in the DataFrame
            if column in df.columns:
                # Apply the hash function to the column
                df[column] = df[column].apply(lambda x: salted_hash(str(x), salt))
                logging.info(f"Hashed {column} successfully")
            else:
                #Log that the column is not in the DataFrame
                logging.warning(f"Column '{column}' not found in dataframe.")

        # Save the modified DataFrame to a new CSV file
        df.to_csv(output_directory + output_file, index=False)
        logging.info(f"Hashed data saved to {output_directory}")
    except FileNotFoundError:
        logging.error(f"File not found: {data_frame}")
    except Exception as e:
        logging.error(f"Error occurred while hashing data: {e}")
