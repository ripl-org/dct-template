"""
AWS S3 Data Uploading Module

This module is designed to process and upload data from a SQLite database to AWS S3 using OData (Open Data Protocol)
format. It is particularly useful in scenarios where data stored in local databases needs to be transferred to the
cloud for further processing, storage, or analysis.

The script starts by configuring the logging system and then reads configuration settings from a YAML file. These
settings include paths to the SQLite database, AWS bucket details, and IAM Roles Anywhere configuration for secure
AWS access.
"""
import logging
import os
import tempfile
import boto3
import iam_rolesanywhere_session
import sql_to_odata
import yaml
from datetime import datetime

# Set Home Directory
home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

# Define the environment as 'prod'
environment = "prod"

# Log Path
log_name = os.path.join("scripts=load", f"load_sqlite_to_odata_{environment}")
log_dir = os.path.join(home, config['paths']['logs_dir'], log_name)
log_file_name = datetime.now().strftime("%Y%m%dT%H%M%S") + f"__load_sqlite_to_odata_{environment}.log"
log_file_path = os.path.join(log_dir, log_file_name)


# Check if the directory exists, if not, create it
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
    logging.info(f"Created log directory: {log_dir}")

# Configure logging
log_format = '%(asctime)s : %(levelname)s : %(name)s : %(message)s'
root_logger = logging.getLogger()
for handler in root_logger.handlers or []:
    root_logger.removeHandler(handler)
logging.basicConfig(filename=log_file_path, format=log_format, level=logging.INFO)
logging.getLogger(sql_to_odata.__name__).setLevel(logging.DEBUG)
log = logging.getLogger(__name__)

# List of tables to include in processing
tables_to_include = [
    "CallsForService", "OfficerRadioLog", "Offense", "Incidents",
    "TrafficStops", "Trailing12MonthAnnualizedCrimeRate", "VictimAggregate",
    "OffenderAggregate", "ArrestsAggregate", "UseOfForce",
    "OfficerRadioLogMinResponseTime", "UseOfForceByTimeOfDay"
]

# Load database and AWS configurations from the YAML file
input_sqlite_filename = os.path.join(home, config['databases']['derived_tables'])
output_bucket_name = config['aws'][environment]['bucket_name']
output_bucket_prefix = config['aws'][environment]['output_bucket_prefix']

# IAM Roles Anywhere session configuration
trust_anchor_arn = config['aws'][environment]['iamanywhere']['trust_anchor_arn']
profile_arn = config['aws'][environment]['iamanywhere']['profile_arn']
role_arn = config['aws'][environment]['iamanywhere']['role_arn']
certificate = os.path.join(home, config['aws'][environment]['iamanywhere']['certificate'])
private_key = os.path.join(home, config['aws'][environment]['iamanywhere']['private_key'])
region = config['aws'][environment]['iamanywhere']['region']

# Initialize OData interface with the SQLite DB
odata_interface = sql_to_odata.ODataInterface(sqlite_filename=input_sqlite_filename)

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
s3_transfer_config = boto3.s3.transfer.TransferConfig(max_bandwidth=4*1024*1024)

def upload_file_to_s3(filename, name, content_ext):
    """ Upload a file to S3 """
    key = f'{output_bucket_prefix}/{name}' if output_bucket_prefix else name
    log.info(f'Uploading {filename} to s3://{output_bucket_name}/{key}')
    content_type = f'application/{content_ext};charset=utf-8'
    extra_args = {'ContentType': content_type, 'CacheControl': 'no-store'}
    with open(filename, 'rb') as object_file:
        s3_client.upload_fileobj(object_file, output_bucket_name, key, ExtraArgs=extra_args, Config=s3_transfer_config)

# Process and upload each table
with tempfile.TemporaryDirectory() as temp_folder:
    odata_interface.dump_database(temp_folder, tables_to_include)
    odata_filenames = os.listdir(temp_folder)
    for odata_filename in odata_filenames:
        filename = os.path.join(temp_folder, odata_filename)
        name = odata_filename if odata_filename != '$service' else ''
        content_ext = 'xml' if odata_filename == '$metadata' else 'json'
        upload_file_to_s3(filename, name, content_ext)