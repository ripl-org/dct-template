import os
import iam_rolesanywhere_session
import yaml
from boto3.s3.transfer import TransferConfig
import time

# Set Home Directory
home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

# Define the environment as 'prod'
environment = "prod"

# Load data
json_data_dir = config['paths']['json_storage_dir']

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

tables = ['CallsForService_24HR.json', 'Incidents_24HR.json', 'Offense_24HR.json',
          'TrafficStops_24HR.json', 'LandingPageStats.json'
          ]

for table in tables:
    json_data_filename = os.path.join(home, json_data_dir, table)
    object_key = f'data-dct/{table}'

    with open(json_data_filename, 'rb') as object_file:
        s3_client.upload_fileobj(
            Fileobj=object_file,
            Bucket=output_bucket_name,
            Key=object_key,
            ExtraArgs={'ContentType': 'application/json'},
            Config=s3_transfer_config
        )

    time.sleep(3)