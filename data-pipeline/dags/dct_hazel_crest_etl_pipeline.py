"""
Hazel Crest Police Department ETL Pipeline

This script defines an Airflow DAG (Directed Acyclic Graph) for the Hazel Crest Police Department's 
ETL (Extract, Transform, Load) pipeline. It's designed to automate and manage the workflow of data 
processing tasks for Hazel Crest PD. The pipeline includes steps for backing up databases, 
extracting data, data validation, transformation, and uploading data to different environments.

The workflow is scheduled to run daily, extracting and processing data from various sources, 
transforming it as required, and then loading it into designated databases and storage systems.
"""
import os
import sys
import yaml
import pendulum

from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from airflow.utils.trigger_rule import TriggerRule
from datetime import datetime, timedelta

home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

# Database and script paths from configuration
raw_db = os.path.join(home, config['databases']['raw_tables'])
derived_db = os.path.join(home, config['databases']['derived_tables'])
backup_db_dir = os.path.join(home, config['paths']['backup_db_dir'])
src_path = os.path.join(home, config['paths']['src_dir'])
extract_scripts_dir = os.path.join(home, config['paths']['extract_scripts_dir'])
report_scripts_dir = os.path.join(home, config['paths']['report_scripts_dir'])
load_scripts_dir = os.path.join(home, config['paths']['load_scripts_dir'])
transform_scripts_dir = os.path.join(home, config['paths']['transform_scripts_dir'])
frontend_scripts_dir = os.path.join(home, config['paths']['frontend_scripts_dir'])

# Append source directory to system path
sys.path.append(os.path.join(os.path.dirname(__file__), src_path))
from src_backup_sqlite_db import backup_sqlite_db

# Script List: Contains mapping of tasks to script files
scripts_list = {
    "extract": {
        "extract_cad_master_call_table": "extract_cad_master_call_table.py",
        "extract_cad_traffic_stops": "extract_cad_traffic_stops.py",
        "extract_master_citation_table": "extract_master_citation_table.py",
        "extract_jail_offense_table": "extract_jail_offense_table.py",
        "extract_law_incident_table_law_offense_detail_table": "extract_law_incident_table_law_offense_detail_table.py",
        "extract_officer_radio_log_table": "extract_officer_radio_log_table.py",
        "extract_table_of_involvements": "extract_table_of_involvements.py",
        "extract_offender": "extract_offender.py",
        "extract_victim": "extract_victim.py"
    },
    "transform": {
        "transform_table_arrests_aggregation": "transform_table_arrests_aggregation.R",
        "transform_table_calls_for_service": "transform_table_calls_for_service.R",
        "transform_table_crime_rate": "transform_table_crime_rate.R",
        "transform_table_incidents": "transform_table_incidents.R",
        "transform_table_offender_aggregation": "transform_table_offender_aggregation.R",
        "transform_table_offense": "transform_table_offense.R",
        "transform_table_officer_radio_log": "transform_table_officer_radio_log.R",
        "transform_table_traffic_stops": "transform_table_traffic_stops.R",
        "transform_table_victim_aggregation": "transform_table_victim_aggregation.R",
    }
}

# DAG Configuration: Defines properties and schedule of the DAG
with DAG(
        'dct_hazel-crest_etl_pipeline',
        default_args={
            "depends_on_past": False,
            "email": config['airflow_defaults']['email'],
            "email_on_failure": True,
            "email_on_retry": True,
            "retries": 1,
            "retry_delay": timedelta(minutes=5)
        },
        description="Hazel Crest Police Department ETL Pipeline for https://hazelcrest.dataforcommunitytrust.org/ site.",
        schedule='0 0 * * *',
        start_date=pendulum.datetime(2024, 3, 19, tz="America/Chicago"),
        catchup=False,
        tags=["HCPD", "DCT", "Hazel Crest Police Department", "dataforcommunitytrust"]
         ) as dag:

    # Start Dag: Marks the start of the DAG
    start_dag = BashOperator(
        task_id='start_dag',
        bash_command='echo Start Dag'
    )

    # Backup DB Raw Tables: Back-up SQLite file for Raw Tables
    backup_db_raw_tables = PythonOperator(
        task_id='backup_db_raw_tables',
        python_callable=backup_sqlite_db,
        op_kwargs={'db_path': f'{raw_db}',
                   'backup_dir': f'{backup_db_dir}/raw',
                   'db_name': 'HazelCrestRawTables'}
    )

    # Backup DB Derived Tables:  Back-up SQLite file for Derived Tables
    backup_db_derived_tables = PythonOperator(
        task_id='backup_db_derived_tables',
        python_callable=backup_sqlite_db,
        op_kwargs={'db_path': f'{derived_db}',
                   'backup_dir': f'{backup_db_dir}/derived',
                   'db_name': 'HazelCrestDerivedTables'}
    )

    # Start Extract: Marks the start of the extract jobs
    start_extract = BashOperator(
        task_id='start_extract',
        bash_command='echo Start Extract'
    )

    # Run all Extract files
    extract_task_list = []
    for table_name, file_name in scripts_list['extract'].items():

        extract_task = BashOperator(
            task_id=f"{table_name}",
            bash_command=f'python3 {extract_scripts_dir}/{file_name} '
        )
        extract_task_list.append(extract_task)

    # produces reports that show the shape of each file
    validate_log_data = BashOperator(
        task_id="validate_log_data",
        bash_command=f'python3 {report_scripts_dir}/report_create_raw_data_validation_report.py ',
        trigger_rule=TriggerRule.ALL_DONE
    )

    # upload data to SQLite Raw Tables
    upload_sqlite_raw_tables = BashOperator(
        task_id="upload_sqlite_raw_tables",
        bash_command=f'python3 {load_scripts_dir}/load_files_sqlite_raw_database.py '
    )

    # Run all Transform files
    transform_task_list = []
    for table_name, file_name in scripts_list['transform'].items():

        transform_task = BashOperator(
            task_id=f"{table_name}",
            bash_command=f'Rscript {transform_scripts_dir}/{file_name} '
        )
        transform_task_list.append(transform_task)

    # Start Additional File Calculations for Frontend
    start_frontend_data_prep = BashOperator(
        task_id='start_frontend_data_prep',
        bash_command='echo Start Frontend Data Prep',
        trigger_rule=TriggerRule.ALL_DONE
    )

    frontend_24hour_data_to_json_file = BashOperator(
        task_id="frontend_24hour_data_to_json_file",
        bash_command=f'python3 {frontend_scripts_dir}/frontend_24hour_data_to_json_file.py '
    )

    frontend_landingpage_stats_calculate = BashOperator(
        task_id="frontend_landingpage_stats_calculate",
        bash_command=f'Rscript {frontend_scripts_dir}/frontend_landingpage_stats_calculate.R '
    )

    frontend_landingpage_stats_to_json_file = BashOperator(
        task_id="frontend_landingpage_stats_to_json_file",
        bash_command=f'python3 {frontend_scripts_dir}/frontend_landingpage_stats_to_json_file.py '
    )

    # Start S3 Upload
    start_s3_upload = BashOperator(
        task_id='start_s3_upload',
        bash_command='echo Start S3 Upload',
        trigger_rule=TriggerRule.ALL_DONE
    )

    # Dev: Pull data from SQLite Derived DB, transform to ODATA, push to S3 bucket
    dev_transform_odata_upload_s3 = BashOperator(
        task_id="dev_transform_odata_upload_s3",
        bash_command=f'python3 {load_scripts_dir}/load_sqlite_to_odata_dev.py '
    )

    # Prod: Pull data from SQLite Derived DB, transform to ODATA, push to S3 bucket
    prod_transform_odata_upload_s3 = BashOperator(
        task_id="prod_transform_odata_upload_s3",
        bash_command=f'python3 {load_scripts_dir}/load_sqlite_to_odata_prod.py '
    )

    dev_load_json_24hr_file_s3 = BashOperator(
        task_id="dev_load_json_24hr_file_s3",
        bash_command=f'python3 {load_scripts_dir}/load_json_24hr_file_dev.py '
    )

    prod_load_json_24hr_file_s3 = BashOperator(
        task_id="prod_load_json_24hr_file_s3",
        bash_command=f'python3 {load_scripts_dir}/load_json_24hr_file.py '
    )

    load_download_data_zipfiles = BashOperator(
        task_id="load_download_data_zipfiles",
        bash_command=f'python3 {load_scripts_dir}/load_download_data_zipfiles.py '
    )

    # End of the pipeline
    end_dag = BashOperator(
        task_id='end_dag',
        bash_command='echo End Dag'
    )

(start_dag >> [backup_db_raw_tables, backup_db_derived_tables]
 >> start_extract >> extract_task_list
 >> validate_log_data >> upload_sqlite_raw_tables
 >> transform_task_list
 >> start_frontend_data_prep >> frontend_24hour_data_to_json_file >> frontend_landingpage_stats_calculate
 >> frontend_landingpage_stats_to_json_file
 >> start_s3_upload >> [dev_transform_odata_upload_s3, prod_transform_odata_upload_s3,
                        dev_load_json_24hr_file_s3, prod_load_json_24hr_file_s3, load_download_data_zipfiles]
 >> end_dag)
