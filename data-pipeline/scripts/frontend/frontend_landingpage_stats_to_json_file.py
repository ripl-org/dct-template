import pandas as pd
from datetime import datetime, timedelta
import json
import yaml
import os
import sqlite3
import pytz

# Set Home Directory
home = os.environ.get('HOME')

cst_timezone = pytz.timezone('America/Chicago')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

# Path to your SQLite database
db_path = os.path.join(home, config['databases']['derived_tables'])

# Connect to SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Execute SQL query
cursor.execute('SELECT * FROM LandingPageStats')
data = cursor.fetchall()
columns = [description[0] for description in cursor.description]
LandingPageStats = pd.DataFrame(data, columns=columns)

structured_data = {"data_last_updated": datetime.now(cst_timezone).strftime("%Y-%m-%d %H:%M:%S"),
                    "start_date": (datetime.now(cst_timezone) - timedelta(days=7)).strftime("%Y-%m-%d"),
                    "end_date": (datetime.now(cst_timezone) - timedelta(days=1)).strftime("%Y-%m-%d"),
                   }

for zone, zone_df in LandingPageStats.groupby("Zone"):
    zone_data = {}
    for category, category_df in zone_df.groupby("category"):
        category_data = {
            # Convert numpy int64 to int (native Python type) using .item()
            "last_7_days_incidents_count": int(category_df["last_7_days_incidents_count"].values[0].item()),
            "past_year_weekly_avg_incidents_count": int(category_df["past_year_weekly_avg_incidents_count"].values[0].item())
        }
        zone_data[category] = category_data
    structured_data[zone] = zone_data

with open('/home/ripl/airflow/data/processed/json/LandingPageStats.json', 'w') as json_file:
    json.dump(structured_data, json_file, indent=4)