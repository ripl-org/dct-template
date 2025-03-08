import sqlite3
import os
import yaml

home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

DB_PATH = os.path.join(home, config['databases']['raw_tables'])

# Connect to your SQLite database
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Add a new column named "MainNamesTable" of type TEXT to the "Victim" table
cursor.execute("ALTER TABLE JailOffenseTable ADD COLUMN JailInmateTable TEXT;")

# Commit the changes to the database
conn.commit()