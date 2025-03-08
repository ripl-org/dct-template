import os

def create_config_yaml(base_directory):
    # YAML content
    yaml_content = """
        # Replace this line with your own base directory
        # Example: base_dir: /base/path/here/airflow
        #base_dir: "<base_directory_path>"
        
        paths:
          dags_dir: "/dags"
          logs_dir: "/logs"
          reports_dir: "/reports"
          src_dir: "/src"
          archive_dir: "/data/archive"
          extracted_csv_dir: "/data/raw/files"
          raw_sqlite_database_files_dir: "/data/raw/database/HazelCrestRawTables.db"
          derived_sqlite_database_files_dir: "/data/processed/database/HazelCrestDerivedTables.db"
          extract_scripts_dir: "/scripts/extract"
          load_scripts_dir: "/scripts/load"
          report_scripts_dir: "/scripts/report"
          transform_scripts_dir: "/scripts/transform"
          backup_db_dir: "/home/ripl/backup_SQLiteDatabaseFiles"
        
        databases:
          raw_tables: "/data/raw/database/HazelCrestRawTables.db"
          derived_tables: "/data/processed/database/HazelCrestDerivedTables.db"
        
        # Set-up ecom_vmware credentials for Motorola Spillman Flex API
        #ecom_vmware:
        #  username: "<username>"
        #  password: "<password>"
        #  hostname: "<hostname>"
        #  port: "<port>"
        
        # Set-up AWS credentials. This is required in order to push derived data tables to an S3 bucket in AWS
        #aws:
        #  prod:
        #    aws_account: "<prod_aws_account_name>"
        #    bucket_name: "<prod_bucket_name>"
        #    output_bucket_prefix: "<prod_output_bucket_prefix>"
        #    iamanywhere:
        #      trust_anchor_arn: "<prod_trust_anchor_arn>"
        #      profile_arn: "<prod_profile_arn>"
        #      role_arn: "<prod_role_arn>"
        #      certificate: "<prod_certificate_path>"
        #      private_key: "<prod_private_key_path>"
        #      region: "<aws_region>"
        """.strip()

    # Ensure base directory exists
    os.makedirs(base_directory, exist_ok=True)

    # Define the full path for the config.yaml file
    file_path = os.path.join(base_directory, 'config2.yaml')

    # Write the content to the file
    with open(file_path, 'w') as file:
        file.write(yaml_content)

    print(f"config.yaml has been created at {file_path}")

# Prompt the user for the base directory
base_directory = input("Enter the base directory path where config.yaml should be saved: ")
create_config_yaml(base_directory)