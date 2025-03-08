"""
Database Backup Utility Module

This module provides functionality for backing up SQLite databases. It is designed
to be used in environments where regular backups of database files are necessary,
such as in application data management or automated maintenance tasks.

The module contains a function `backup_sqlite_db` which takes a path to an SQLite
database file, a backup directory, and a database name as inputs. It optionally
accepts a timestamp format. This function creates a timestamped backup of the
specified database in the given directory.
"""
import logging
import os
import shutil
from datetime import datetime


def backup_sqlite_db(db_path, backup_dir, db_name, timestamp_format="%Y%m%d%H%M%S"):
    """
    Backs up an SQLite database to a specified directory with a timestamp and keeps only the latest 2 backups.

    This function checks if the database file exists and if the backup directory is valid.
    It then creates a backup with a timestamp in the specified backup directory.
    After backing up, it checks the backup directory and keeps only the latest 2 backup files, deleting the rest.

    Parameters:
    db_path (str): The path to the SQLite database file.
    backup_dir (str): The directory where the backup should be stored.
    db_name (str): Name of the database.
    timestamp_format (str, optional): The format for the timestamp. Defaults to '%Y%m%d%H%M%S'.

    Returns:
    str: The path to the backed up database file, or None if an error occurred.
    """
    try:
        # Validate the database file
        if not os.path.isfile(db_path):
            logging.error(f"The specified database at {db_path} does not exist.")
            return None

        # Ensure the backup directory exists
        if not os.path.exists(backup_dir):
            logging.info(f"Creating backup directory at {backup_dir}")
            os.makedirs(backup_dir)

        # Create the backup file path
        timestamp = datetime.now().strftime(timestamp_format)
        backup_path = os.path.join(backup_dir, f"backup_{db_name}_{timestamp}.db")

        # Perform the backup
        shutil.copyfile(db_path, backup_path)
        logging.info(f"Database backed up to {backup_path}")

        # Cleanup: Keep only the latest 2 backup files
        backups = sorted([f for f in os.listdir(backup_dir) if f.startswith(f"backup_{db_name}")],
                         key=lambda x: os.path.getmtime(os.path.join(backup_dir, x)))

        # Delete all but the latest 2 backups
        for old_backup in backups[:-2]:
            os.remove(os.path.join(backup_dir, old_backup))
            logging.info(f"Deleted old backup: {old_backup}")

        return backup_path
    except Exception as e:
        logging.error(f"Failed to backup database: {e}")
        return None
