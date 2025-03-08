import json
import os
import pandas as pd
import pytz
import sqlite3
import yaml
import numpy as np

from datetime import datetime, timedelta

try:
    # Set Home Directory
    home = os.environ['HOME']

    # Load the YAML configuration file for paths
    config_path = os.path.join(home, 'airflow', 'config.yaml')
    with open(config_path, 'r') as file:
        config = yaml.safe_load(file)

    # JSON Directory
    json_data_dir = config['paths']['json_storage_dir']

    # Database Path
    db_path = os.path.join(home, config['databases']['derived_tables'])

    # Timezone
    central_tz = pytz.timezone('US/Central')
    yesterday = (datetime.now(central_tz) - timedelta(days=1)).date()

    # Connect to SQLite database
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()

        # Function to load data and process it
        def process_table(query, time_column_name, tz_info, date_filter):
            cursor.execute(query)
            data = cursor.fetchall()
            columns = [description[0] for description in cursor.description]
            df = pd.DataFrame(data, columns=columns)

            # Convert and filter datetime
            df[time_column_name] = pd.to_datetime(df[time_column_name], utc=True).dt.tz_convert(tz_info)
            df['DateReported'] = df[time_column_name].dt.date
            df = df[df['DateReported'] == date_filter].copy()
            df[time_column_name] = df[time_column_name].astype(str)
            df = df.drop(columns=['DateReported'])
            df = df.replace({np.nan: None})

            return df

        tables = {
            "CallsForService": "TimeDateReported",
            "Incidents": "TimeDateReported",
            "TrafficStops": "Occurred",
            "Offense": "TimeDateReported"
        }

        results = {}

        for table_name, time_column in tables.items():
            df = process_table(f'SELECT * FROM {table_name}', time_column, central_tz, yesterday)
            results[table_name] = {
                "date_last_updated": datetime.now(central_tz).strftime("%Y-%m-%d %H:%M:%S"),
                "data": df.to_dict(orient="records")
            }

            updated_file_path = os.path.join(home, json_data_dir, f"{table_name}_24HR.json")
            with open(updated_file_path, 'w') as file:
                json.dump(results[table_name], file, indent=4)

except Exception as e:
    print(f"An error occurred: {e}")