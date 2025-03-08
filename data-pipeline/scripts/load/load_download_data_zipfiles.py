import sqlite3
import csv
import zipfile
from pathlib import Path
import time
import os
import iam_rolesanywhere_session
import yaml
from boto3.s3.transfer import TransferConfig

# Set Home Directory
home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

# Define the environment as 'prod'
environment = "prod"

# Path to your SQLite database
db_path = os.path.join(home, config['databases']['derived_tables'])

# Directory where you want to save your CSV files and the final ZIP file
output_dir = os.path.join(home, config['paths']['zipfile_storage_dir'])
zipfile_data_dir = os.path.join(home, config['paths']['zipfile_storage_dir'])

# Load database and AWS configurations from the YAML file
output_bucket_name = config['aws'][environment]['bucket_name']
output_bucket_prefix = config['aws'][environment]['output_bucket_prefix']

# IAM Roles Anywhere session configuration
trust_anchor_arn = config['aws'][environment]['iamanywhere']['trust_anchor_arn']
profile_arn = config['aws'][environment]['iamanywhere']['profile_arn']
role_arn = config['aws'][environment]['iamanywhere']['role_arn']
certificate = os.path.join(home, config['aws'][environment]['iamanywhere']['certificate'])
private_key = os.path.join(home, config['aws'][environment]['iamanywhere']['private_key'])
region = config['aws'][environment]['iamanywhere']['region']

# Connect to SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Define your tables
tables = [
    "CallsForService", "OfficerRadioLog", "Offense", "Incidents",
    "TrafficStops", "Trailing12MonthAnnualizedCrimeRate", "VictimAggregate",
    "OffenderAggregate", "ArrestsAggregate", "UseOfForce"
]

dict = {
    "CallsForService": ["CallsForService", "Incidents", "OfficerRadioLog", "DataDictionary"],
    "Crimes": ["Offense", "ArrestsAggregate", "VictimAggregate", "OffenderAggregate", "DataDictionary"],
    "UseOfForce": ["UseOfForce", "DataDictionary"],
    "TrafficStops": ["TrafficStops", "DataDictionary"],
    "CrimeDemographics": ["ArrestsAggregate", "VictimAggregate", "OffenderAggregate", "DataDictionary"]
}

# Iterate over each table to export data
for table in tables:
    # Fetch the column names first
    cursor.execute(f'PRAGMA table_info({table})')
    columns_info = cursor.fetchall()
    columns = [col[1] for col in columns_info]

    # Filter out 'Latitude' and 'Longitude' if they exist
    filtered_columns = [col for col in columns if col not in ('Latitude', 'Longitude')]
    # Ensure column names are enclosed in double quotes to handle any special characters or reserved keywords
    filtered_columns_str = ', '.join([f'"{col}"' for col in filtered_columns])  # Modify here

    # Execute SQL query to fetch data from the filtered columns
    cursor.execute(f'SELECT {filtered_columns_str} FROM "{table}"')  # Also enclose table name in double quotes if necessary
    rows = cursor.fetchall()

    # CSV file path for this table
    csv_file_path = os.path.join(output_dir, f'{table}.csv')

    # Write data to CSV
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(filtered_columns)  # Write the filtered column headers
        writer.writerows(rows)  # Write the rows of data

# Close the connection to the database
conn.close()

# Create a ZIP file containing all the CSV files
output_dir = Path(output_dir)
for table_name, dict_tables in dict.items():
    zip_file_path = os.path.join(output_dir, f'{table_name}_page.zip')
    with zipfile.ZipFile(zip_file_path, 'w') as zipf:
        for table in dict_tables:
            # Path to the CSV file
            csv_file_path = output_dir / f'{table}.csv'
            # Add CSV file to the ZIP file
            zipf.write(csv_file_path, arcname=csv_file_path.name)
        time.sleep(5)

# IAM Roles Anywhere session for AWS services
roles_anywhere_session = iam_rolesanywhere_session.IAMRolesAnywhereSession(
    trust_anchor_arn=trust_anchor_arn,
    profile_arn=profile_arn,
    role_arn=role_arn,
    certificate=certificate,
    private_key=private_key,
    region=region
)
boto3_session = roles_anywhere_session.get_session()
s3_client = boto3_session.client('s3')

# S3 Transfer configuration
s3_transfer_config = TransferConfig(multipart_threshold=1024 * 25,  # Set as needed
                                    max_concurrency=10,  # Set as needed
                                    multipart_chunksize=1024 * 25,  # Set as needed
                                    use_threads=True)

zipfiles = ['CallsForService_page.zip', 'Crimes_page.zip',
            'TrafficStops_page.zip', 'UseOfForce_page.zip',
            "CrimeDemographics_page.zip"
            ]

for zipfile in zipfiles:
    zipfile_data_filename = os.path.join(home, zipfile_data_dir, zipfile)
    object_key = f'data-dct/{zipfile}'

    with open(zipfile_data_filename, 'rb') as object_file:
        s3_client.upload_fileobj(
            Fileobj=object_file,
            Bucket=output_bucket_name,
            Key=object_key,
            ExtraArgs={'ContentType': 'application/zip'},
            Config=s3_transfer_config
        )
