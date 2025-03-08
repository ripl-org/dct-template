#/usr/bin/env bash

python3 refresh_workbook.py AnnualizedCrimeRate_17059403450570
# python3 refresh_workbook.py CallsForService_17059395487030  # Timeout
python3 refresh_workbook.py CrimeArrest_17304854314950
python3 refresh_workbook.py CrimeOffender_17059391850310
# python3 refresh_workbook.py Crimes_17059390129380  # Timeout
python3 refresh_workbook.py CrimeVictim_17059391178000
python3 refresh_workbook.py OfficerRadioLogs_17059389218890
python3 refresh_workbook.py OfficerResponseTime
# python3 refresh_workbook.py TrafficStops_17059399605060  # Timeout
# python3 refresh_workbook.py UseofForce_17061083109850
# python3 refresh_workbook.py UseofForceByTimeofDay  # Manually updated monthly
# python3 refresh_workbook.py UseofForceWeaponType  # Manually updated monthly

# TODO TRY REQUESTS TIMEOUTS
