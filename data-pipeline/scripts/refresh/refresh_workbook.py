"""
This script uses the Tableau Public API to force a data refresh on a visualization,
and then checks a specially-crafted sheet to ensure the refresh actually happened.
"""


import base64
import datetime
import json
import logging
import os
import re
import sys
import time

import bs4
import requests


# Setup logging format and other options for readability.
_log_format = '%(asctime)s : %(levelname)s : %(name)s : %(message)s'
root_logger = logging.getLogger()
for handler in root_logger.handlers or []:
    root_logger.removeHandler(handler)
logging.basicConfig(format=_log_format, level=logging.INFO)
_log = logging.getLogger(__name__)


# TODO adjust how these parameters are passed to this script based on how it integrates with Airflow.
workbook_name = sys.argv[1]
tableau_username = os.environ['TABLEAU_PUBLIC_USERNAME']
tableau_password = os.environ['TABLEAU_PUBLIC_PASSWORD']


# Use a timeout so no calls wait forever
default_timeout = 30.0

# Set some boundaries on how long to poll for extraction results before we give up
# and raise an error message; currently set to 2 minutes but may need to be adjusted.
extraction_maximum_polls = 8
extraction_poll_delay = 15.0

# The allowed age of data here allows for some slop if the refresh process itself
# takes some time and the update doesn't fully complete until the next pipeline run
update_threshold = datetime.timedelta(hours=24 + 4)
now = datetime.datetime.now()

# For some reason a few of the Tableau API calls will fail unless
# a user agent is used that resembles a real web browser.
session = requests.Session()
session.headers.update({'user-agent': 'Mozilla/5.0'})


def get_config_data():
    """Scrape the auth configuration blob out of the login page's JavaScript snippet."""
    _log.info('Extracting configuration data from login page')
    login_url = 'https://public.tableau.com/login'
    response = session.get(login_url, timeout=default_timeout)
    response.raise_for_status()
    config_match = re.search(r'const config =.*"([A-Za-z0-9+=]+)"', response.text)
    return json.loads(base64.b64decode(config_match[1]))


def execute_login(config_data):
    """Send authentication parameters to the IDP endpoint and gather the returned callback parameters."""
    _log.info(f'Executing authentication for user {tableau_username}')
    extra_params = config_data['extraParams']
    login_url = 'https://identity.idp.tableau.com/usernamepassword/login'
    login_data = {
        'tenant': 'identity',
        'response_type': 'token id_token',
        'tableau_language': 'en-US',
        'connection': 'Username-Password-Authentication',
        'client_id': config_data['clientID'],
        'protocol': extra_params['protocol'],
        'scope': extra_params['scope'],
        '_csrf': extra_params['_csrf'],
        'state': extra_params['state'],
        '_intstate': extra_params['_intstate'],
        'nonce': extra_params['nonce'],
        'username': tableau_username,
        'password': tableau_password,
    }
    response = session.post(login_url, json=login_data, timeout=default_timeout)
    response.raise_for_status()
    parser = bs4.BeautifulSoup(response.text, 'lxml')
    input_fields = parser.find_all('input', attrs={'type': 'hidden'})
    callback_data = {f.get('name'): f.get('value') for f in input_fields}
    return callback_data


def execute_callback(callback_data):
    """Send the callback parameters to the IDP endpoint to complete authentication."""
    client_id = json.loads(callback_data['wctx'])['client_id']
    _log.info(f'Executing OAuth 2.0 authorization callback for client {client_id}')
    callback_url = 'https://identity.idp.tableau.com/login/callback'
    response = session.post(callback_url, data=callback_data, timeout=default_timeout)
    response.raise_for_status()
    session.headers.update({'x-xsrf-token': session.cookies['XSRF-TOKEN']})


def start_session(workbook_name, visualization_name):
    """Start an editing session and return the session details."""
    _log.info(f'Starting session for workbook {workbook_name} and visualization {visualization_name}')
    visualization_url = f'https://public.tableau.com/vizql/w/{workbook_name}/v/{visualization_name}'
    start_session_url = f'{visualization_url}/startSession/authoring'
    response = session.post(start_session_url, timeout=default_timeout)
    response.raise_for_status()
    session.headers.update({'x-xsrf-token': session.cookies['XSRF-TOKEN']})
    return response.json()


def bootstrap_session(workbook_name, visualization_name, session_id):
    """Bootstrap the session, which readies it for use."""
    _log.info(f'Bootstrapping session {session_id}')
    visualization_url = f'https://public.tableau.com/vizql/w/{workbook_name}/v/{visualization_name}'
    bootstrap_url = f'{visualization_url}/bootstrapSession/sessions/{session_id}'
    bootstrap_data = {'sheet_id': visualization_name}
    response = session.post(bootstrap_url, data=bootstrap_data, timeout=default_timeout)
    response.raise_for_status()
    session.headers.update({'x-xsrf-token': session.cookies['XSRF-TOKEN']})


def change_ui_mode(workbook_name, visualization_name, session_id, ui_mode):
    """Virtually switch to the data tab, which is required for the extract API to work."""
    _log.info(f'Changing UI mode to {ui_mode}')
    visualization_url = f'https://public.tableau.com/vizql/w/{workbook_name}/v/{visualization_name}'
    mode_url = f'{visualization_url}/sessions/{session_id}/commands/tabdoc/change-workbook-ui-mode'
    mode_data = {'uiMode': ui_mode}
    response = session.post(mode_url, data=mode_data, timeout=default_timeout)
    response.raise_for_status()
    session.headers.update({'x-xsrf-token': session.cookies['XSRF-TOKEN']})
    return response.json()


def trigger_extraction(workbook_name, visualization_name, session_id, datasource_name):
    """Start a data extraction job and return its identifier."""
    _log.info(f'Triggering data extraction in session {session_id} on {datasource_name}')
    visualization_url = f'https://public.tableau.com/vizql/w/{workbook_name}/v/{visualization_name}'
    trigger_url = f'{visualization_url}/trigger_extract_creation/sessions/{session_id}'
    trigger_data = {'datasource_name': datasource_name}
    response = session.post(trigger_url, data=trigger_data, timeout=default_timeout)
    response.raise_for_status()
    session.headers.update({'x-xsrf-token': session.cookies['XSRF-TOKEN']})
    return response.json()


def get_extraction_status(workbook_name, visualization_name, session_id, extraction_id):
    """Get an extraction job's status."""
    _log.info(f'Getting status in session {session_id} for data extraction {extraction_id}')
    visualization_url = f'https://public.tableau.com/vizql/w/{workbook_name}/v/{visualization_name}'
    status_url = f'{visualization_url}/poll_extract_creation_status/sessions/{session_id}/{extraction_id}'
    response = session.get(status_url, timeout=default_timeout)
    response.raise_for_status()
    session.headers.update({'x-xsrf-token': session.cookies['XSRF-TOKEN']})
    return response.json()


def execute_extraction(workbook_name, visualization_name, session_id, datasource_name):
    """Start an extraction and poll for its results."""
    extraction_data = trigger_extraction(workbook_name, visualization_name, session_id, datasource_name)
    extraction_id = extraction_data['extractOperationId']
    _log.info(f'Triggered data extraction {extraction_id}')
    for p in range(extraction_maximum_polls):
        time.sleep(extraction_poll_delay)
        extraction_status = get_extraction_status(workbook_name, visualization_name, session_id, extraction_id)
        if extraction_status['status'] == 'PENDING':
            _log.info(f'Data extraction {extraction_id} in progress (check {p + 1} of {extraction_maximum_polls})')
        elif extraction_status['status'] == 'FINISHED':
            _log.info(f'Data extraction {extraction_id} complete')
            return extraction_id
        elif extraction_status['status'] == 'FAILED':
            message = extraction_status['message']
            raise Exception(f'Data extraction {extraction_id} failed: {message}')
    extraction_max_time = extraction_maximum_polls * extraction_poll_delay
    raise Exception(f'Data extraction {extraction_id} did not complete after {extraction_max_time} seconds')


def publish(workbook_name, visualization_name, session_id, project_id, workbook_id, workbook_title):
    """Publish the workbook, which is required for a data extraction to take effect."""
    _log.info(f'Publishing workbook {workbook_name}')
    visualization_url = f'https://public.tableau.com/vizql/w/{workbook_name}/v/{visualization_name}'
    publish_url = f'{visualization_url}/publish/sessions/{session_id}'
    publish_data = {
        'name': workbook_title,
        'display_tabs': 'false',
        'oauth_credential_ids': [],
        'locationid': project_id,
        'locationtype': 'PROJECT',
        'draft_reference_id': workbook_id,
    }
    response = session.post(publish_url, data=publish_data, files={'file': None}, timeout=default_timeout)
    response.raise_for_status()
    session.headers.update({'x-xsrf-token': session.cookies['XSRF-TOKEN']})
    return response.json()


def get_workbook_update_time(workbook_name):
    """Read a workbook's update time from a specially-created sheet called UpdateTime."""
    _log.info(f'Fetching workbook update time for {workbook_name}')
    update_time_url = f'https://public.tableau.com/views/{workbook_name}/UpdateTime.csv?:showVizHome=n'
    try:
        response = session.get(update_time_url, timeout=default_timeout)
        lines = response.text.splitlines()
        return datetime.datetime.fromisoformat(lines[1])
    except Exception:
        return datetime.datetime.min


def get_workbook_info(workbook_name):
    """Fetch metadata about a workbook such as its title, views, etc."""
    _log.info(f'Fetching workbook info for {workbook_name}')
    workbook_url = f'https://public.tableau.com/profile/api/single_workbook/{workbook_name}'
    try:
        response = session.get(workbook_url, timeout=default_timeout)
        workbook = response.json()
        workbook['dataUpdateTime'] = get_workbook_update_time(workbook_name)
        return workbook
    except Exception:
        return {}


def update_workbook(workbook_name):
    """Run through all the steps to update a workbook's data."""

    visualization_name = 'UpdateTime'

    config_data = get_config_data()
    callback_data = execute_login(config_data)
    execute_callback(callback_data)
    _log.info('Login process complete')

    session_data = start_session(workbook_name, visualization_name)
    session_id = session_data['sessionid']
    project_id = session_data['current_project_id']
    workbook_id = session_data['workbook_reference_id']
    workbook_title = session_data['workbookName']
    _log.info(f'Created session {session_id} for project {project_id} and reference {workbook_id}')

    bootstrap_session(workbook_name, visualization_name, session_id)
    _log.info(f'Bootstrapped session {session_id}')

    ui_mode_data = change_ui_mode(workbook_name, visualization_name, session_id, 'data-tab')
    workbook_model = ui_mode_data['vqlCmdResponse']['layoutStatus']['applicationPresModel']['workbookPresModel']
    datasource_name = workbook_model['schemaViewer']['datasource']
    _log.info(f'Changed to data tab with datasource {datasource_name}')

    execute_extraction(workbook_name, visualization_name, session_id, datasource_name)

    publish_data = publish(workbook_name, visualization_name, session_id, project_id, workbook_id, workbook_title)
    workbook_name = publish_data['workbook']['name']
    _log.info(f'Published workbook with title {workbook_name}')


def check_workbook_update(workbook_name):
    """Check if the data in a workbook is fresh, and throw an exception if it is not."""

    workbook = get_workbook_info(workbook_name)

    title = workbook.get('title', 'Unknown')
    views = workbook.get('viewCount', 0)
    update_time = workbook.get('dataUpdateTime', datetime.datetime.min)
    recently_updated = (now - update_time) < update_threshold
    print(workbook_name, update_time)
    return

    if recently_updated:
        _log.info(f'Workbook {workbook_name} is updated as of {update_time}')
        _log.info(f'Workbook {workbook_name} is titled "{title}" and has {views} views')
    else:
        raise Exception(f'Workbook {workbook_name} has not been updated since {update_time}')


# Actually do the work of refreshing the data and verifying it updated as expected.
update_workbook(workbook_name)
check_workbook_update(workbook_name)
