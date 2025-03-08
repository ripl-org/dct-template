#
# import os
# import pandas as pd
#
# # Specify the directory containing the CSV files
# directory_path = '/home/ripl/airflow/data/raw/files'
#
# # Initialize an empty list to hold DataFrames
# dataframes = []
#
# # Loop through the files in the directory
# for filename in os.listdir(directory_path):
#     # Check if the file is a CSV and contains the word "victim"
#     if filename.lower().endswith('.csv') and 'names' in filename.lower():
#         # Construct the full file path
#         file_path = os.path.join(directory_path, filename)
#         # Read the CSV file into a DataFrame and append it to the list
#         df = pd.read_csv(file_path)
#         dataframes.append(df)
#
# # Concatenate all the DataFrames in the list into a single DataFrame
# concatenated_df = pd.concat(dataframes, ignore_index=True)
#
# # Optionally, save the concatenated DataFrame to a new CSV file
# output_file_path = os.path.join(directory_path, 'concatenated_MainNamesTable.csv')
# concatenated_df.to_csv(output_file_path, index=False)

# import logging
# import os
# import requests
# import sys
# import yaml
# from datetime import datetime, timedelta
# from dateutil.relativedelta import relativedelta
#
# home = os.environ.get('HOME')
# script_name = "extract_victim"
#
# # Load the YAML configuration file for paths
# with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
#     config = yaml.safe_load(file)
#
# # Set directory paths
# extracted_csv_dir = os.path.join(home, config['paths']['extracted_csv_dir'])
# src_path = os.path.join(home, config['paths']['src_dir'])
# log_dir = os.path.join(home, config['paths']['logs_dir'], "scripts=extract", script_name)
# OUTPUT_DIRECTORY = os.path.join(home, extracted_csv_dir)
#
# # Include the src directory in the system path for importing modules
# sys.path.append(os.path.join(os.path.dirname(__file__), src_path))
#
# # Import custom modules from the src directory
# from src_extract_hash_raw_data import parse_xml, salted_hash, hash_columns
#
# # Check if the directory exists, if not, create it
# if not os.path.exists(log_dir):
#     os.makedirs(log_dir)
#     logging.info(f"Created log directory: {log_dir}")
#
# # Set-up Logging
# log_file_name = datetime.now().strftime("%Y%m%dT%H%M%S") + f"__{script_name}.log"
# log_file_path = os.path.join(log_dir, log_file_name)
# logging.basicConfig(filename=log_file_path,
#                     level=logging.INFO,
#                     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#                     filemode='w'
#                     )
#
# logging.info("Setting up API authentication and configuration")
# # API Authentication and Configuration
# try:
#     AUTH = (config['ecom_vmware']['username'], config['ecom_vmware']['password'])
# except Exception as e:
#     logging.exception("Error in setting up authentication: " + str(e))
#
# BASE_URL = f"http://{config['ecom_vmware']['hostname']}:{config['ecom_vmware']['port']}/DataExchange/REST"
# HEADERS = {'Content-type': 'text/xml'}
#
# logging.info("Setting up output directory for hashed CSV files")
# # Output Directory for Hashed CSV Files
#
# logging.info("Configuring PII and data salts")
# # Salting Configurations
# PII_SALT = config['extract_requirements']['pii_salt']
# DATA_SALT = config['extract_requirements']['data_salt']
#
# logging.info("Calculating dates for API query")
#
# # Calculate the dates for the API query
# # yesterday = datetime.now() - timedelta(days=1)
# # start_date = yesterday.replace(hour=0,
# #                                minute=0,
# #                                second=0,
# #                                microsecond=0)
# # end_date = start_date + timedelta(days=1)
#
# def query_api(start_date, end_date, auth, base_url, headers):
#     """
#     Queries API using XML query and returns the response text.
#
#     Parameters:
#     - start_date (datetime): Start datetime for the query.
#     - end_date (datetime): End datetime for the query.
#     - auth (tuple): Authentication credentials for the API.
#     - base_url (str): Base URL for the API.
#     - headers (dict): Headers for the API request.
#
#     Returns:
#     - str: Response text from the API if successful, otherwise None.
#     """
#     # XML query for the API
#     logging.info("Preparing to query API.")
#     xml_query=f'''<?xml version="1.0" encoding="UTF-8"?>
#                     <PublicSafetyEnvelope version="1.0">
#                         <MessageIdentification/>
#                         <From>Ecom 911</From>
#                         <To/>
#                         <Creation/>
#                         <PublicSafety id="">
#                             <Query modby="true" modwhen="true" addby="true" addwhen="true">
#                                 <Victim>
#                                     <TimeDateAdded search_type="between">
#                                         <SearchValue>{start_date}</SearchValue>
#                                         <SearchValue>{end_date}</SearchValue>
#                                     </TimeDateAdded>
#                                     <MainNamesTable parentField="NameReference" childField="NameNumber"></MainNamesTable>
#                                 </Victim>
#                             </Query>
#                         </PublicSafety>
#                     </PublicSafetyEnvelope>'''
#
#     try:
#         response = requests.post(base_url, headers=headers, auth=auth, data=xml_query)
#         return response.text
#     except requests.exceptions.HTTPError as http_err:
#         logging.error(f"HTTP error occurred during API request: {http_err}")
#     except Exception as err:
#         logging.critical(f"Critical error during API request: {err}")
#     return None
#
# start_date = datetime(year=2024, month=2, day=1, hour=0, minute=0, second=0, microsecond=0)
# end_date = start_date + relativedelta(days=10)
#
# final_end_date = datetime(year=2024, month=4, day=1, hour=0, minute=0, second=0, microsecond=0)
#
# while end_date < final_end_date:
#     print(start_date.strftime("%Y%m%d"))
#
#     # Define files to hash and their corresponding columns
#     files_to_hash = {
#         "Victim": {'output_file': f'{start_date.strftime("%Y%m%d")}_hashed_Victim.csv',
#                             'columns_to_hash': ['DetailRecordReferenceNumber', 'FirstNameOfVictim',
#                                                 'GuardianNameReference', 'LastNameOfVictim',
#                                                 'MiddleNameOfVictim', 'NameReference',
#                                                 'ReportedBy', 'UserWhoAddedRecord',
#                                                 'UserWhoLastModifiedRecord'
#                             ]},
#         "MainNamesTable": {'output_file': f'{start_date.strftime("%Y%m%d")}_hashed_MainNamesTable.csv',
#                            'columns_to_hash': ['NameNumber', 'AliasNameNumber', 'DriverLicenseNumber',
#                                                'FBINumber', 'FirstName', 'LastName', 'MiddleName',
#                                                'RealName', 'UserWhoAddedRecord', 'UserWhoLastModifiedRecord',
#                                                'WorkTelephoneNumber'
#                                                ]}
#     }
#
#
#     for table_name, info in files_to_hash.items():
#         try:
#             logging.info(f"Processing table: {table_name}")
#             html_text = query_api(start_date=start_date.strftime("%Y-%m-%d %H:%M:%S"),
#                                   end_date=end_date.strftime("%Y-%m-%d %H:%M:%S"),
#                                   auth=AUTH, base_url=BASE_URL, headers=HEADERS)
#
#             if html_text:
#                 data_frame = parse_xml(text_file=html_text, table_name=table_name)
#                 if data_frame is not None and not data_frame.empty:
#                     hash_columns(data_frame=data_frame,
#                                  output_file=info['output_file'],
#                                  output_directory=OUTPUT_DIRECTORY,
#                                  columns_to_hash=info['columns_to_hash'],
#                                  salt=DATA_SALT)
#                     logging.info(f"Successfully processed and hashed data for table {table_name}")
#                 else:
#                     logging.warning(f"No data found or empty DataFrame for table {table_name}. Skipping Task.")
#                     sys.exit(99)
#             else:
#                 logging.error(f"Failed to get a valid response for table {table_name}")
#         except Exception as e:
#             logging.critical(f"Critical error while processing table {table_name}: {e}")
#
#     start_date += relativedelta(days=10)
#     end_date = start_date + relativedelta(days=10)
#     if end_date > final_end_date:
#         end_date = final_end_date