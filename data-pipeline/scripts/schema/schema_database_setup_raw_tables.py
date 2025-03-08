"""
SQLite Database Creation Module for Law Enforcement Data

This module facilitates the creation of an SQLite database specifically designed for storing and managing law enforcement
data. It is intended to be used in environments where data from various law enforcement activities need to be organized
and stored in a relational database format.

Upon execution, the module reads configuration details from a YAML file and checks if the specified SQLite database
already exists. If not, it proceeds to create a new database with a predefined schema. The schema includes tables for
arrests, calls for service, incidents, offenders, offenses, officer radio logs, traffic stops, victims, crime rates,
and use of force incidents.

Each table is carefully structured with relevant fields and data types, and foreign key relationships are established
where necessary to maintain data integrity and relational links between tables.
"""
import sqlite3
import os
import yaml

home = os.environ.get('HOME')

# Load the YAML configuration file for paths
with open(os.path.join(home, 'airflow/config.yaml'), 'r') as file:
    config = yaml.safe_load(file)

DB_PATH = os.path.join(home, config['databases']['raw_tables'])

# Check if the database file exists
if os.path.exists(DB_PATH):
    raise Exception(f"Database already exists at path: {DB_PATH}")
else:

    # Connect to your SQLite database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""CREATE Table JailInmateTable (
        "Number" TEXT PRIMARY KEY,
        "TempRelease" TEXT,
        "RecordSecurityID" TEXT,
        "SecurityClassification" TEXT,
        "ReleaseDate" TEXT,
        "PreviousBooking" TEXT,
        "Prmtime" TEXT,
        "Permanentbed" TEXT,
        "PendingRelease" TEXT,
        "NameNumber" TEXT,
        "ModifiedBy" TEXT,
        "WhenModified" TEXT,
        "LocationTime" TEXT,
        "JudicialStatus" TEXT,
        "InstitutionalClass" TEXT,
        "Inmateinjail" TEXT,
        "HandicapAccess" TEXT,
        "DietRestrictions" TEXT,
        "CurrentLocation" TEXT,
        "CurrentBooking" TEXT,
        "ConfidentialRecord" TEXT,
        "CashBalance" TEXT,
        "Agency" TEXT,
        "HouseasAdult" TEXT,
        "AddedBy" TEXT,
        "UserWhoAddedRecord" TEXT,
        "WhenAdded" TEXT)"""
                   )

    cursor.execute("""CREATE Table AgencyCodes (
      "AgencyCode" TEXT PRIMARY KEY,
      "Ceo" TEXT,
      "CeoTitle" TEXT,
      "City" TEXT,
      "County" TEXT,
      "AgencyDescription" TEXT,
      "DispatchTypeLawFireEMS" TEXT,
      "NameOfAgency" TEXT,
      "CeoNameNumber" TEXT,
      "OriOriginRoutingIndicator" TEXT,
      "AgencyID" TEXT,
      "ReportHeading" TEXT,
      "StateAbbreviation" TEXT,
      "TypeOfAgency" TEXT,
      "ZIPCode" TEXT)"""
    )

    cursor.execute("""CREATE Table TableOfCityNamesAndAbbrs (
      "CityCode" TEXT PRIMARY KEY,
      "MileageToCity" TEXT,
      "City" TEXT,
      "StateAbbreviation" TEXT,
      "ZIPCode" TEXT,
      "CountyCode" TEXT)""")

    cursor.execute("""CREATE Table TableOfStateAbbreviations (
      "StateCode" TEXT PRIMARY KEY,
      "LongStateName" TEXT)"""
    )

    cursor.execute("""CREATE Table CADMasterCallTable (
      "RecordNumber" TEXT PRIMARY KEY,
      "AlarmIDNumber" TEXT,
      "CallNature" TEXT,
      "CallPriority" TEXT,
      "CallReceived" TEXT,
      "CallTaker" TEXT, 
      "CallTypeLawFireEMS" TEXT,
      "CityCode" TEXT,
      "ComplainantNameNumber" TEXT,
      "ContactsAddress" TEXT,
      "Determinant" TEXT,
      "DirectionsNumber" TEXT, 
      "GeobaseAddressID" TEXT,
      "HoldUntilTimeDate" TEXT,
      "HowReceived" TEXT,
      "PersonToContact" TEXT,
      "PersonToContactPhone" TEXT,
      "PlateNumberOfStoppedVeh" TEXT,
      "PlateStateAbbreviation" TEXT,
      "RecordSecurityID" TEXT,
      "RespondToAddress" TEXT,
      "TimeDateOccurredEarliest" TEXT,
      "TimeDateOccurredLatest" TEXT,
      "TimeDateRecordLastModified" TEXT,
      "TimeDateReported" TEXT,
      "UserWhoLastModifiedRecord" TEXT)"""
    )

    cursor.execute("""CREATE Table CADTrafficStopTable (
      "RecordNumber" TEXT PRIMARY KEY,
      "PlateStateAbbreviation" TEXT,
      "CityCode" TEXT,
      "StoppedVehicleColor" TEXT,
      "AgencyCode" TEXT,
      "ClearanceOfStop" TEXT,
      "StoppedVechicleMake" TEXT,
      "CallZoneCode" TEXT,
      "UserWhoLastModifiedRecord" TEXT,
      "GeobaseAddressID" TEXT,
      "LongTermCallID" TEXT,
      "PlateNumberOfStoppedVeh" TEXT,
      "CallTaker" TEXT, 
      "Occurred" TEXT,
      "TimeDateRecordLastModified" TEXT,
      "StoppedVehicleModel" TEXT,
      "UnitNumber" TEXT,
      "LocationOfStop" TEXT,
      "Comments" TEXT)"""
    )

    cursor.execute("""CREATE Table MasterCitationTable (
        "CitationNumber" TEXT PRIMARY KEY,
        "Actual" TEXT,
        "AgencyCode" TEXT,
        "AreaLocationCode" TEXT,
        "BondAmount" TEXT,
        "BondType" TEXT,
        "CitationType" TEXT,
        "City" TEXT, 
        "CourtCode" TEXT, 
        "CourtDate" TEXT,
        "DateOfCitation" TEXT,
        "GeobaseAddressID" TEXT,
        "IssuingOfficer" TEXT, 
        "LawIncident" TEXT,
        "NameNumber" TEXT,
        "Posted" TEXT,
        "RecordSecurityID" TEXT,
        "Safe" TEXT,
        "StateAbbreviation" TEXT,
        "StreetAddress" TEXT,
        "TimeDateAdded" TEXT,
        "TimeDateLastModified" TEXT,
        "UserWhoLastModified" TEXT,
        "VehicleNumber" TEXT, 
        "ViolationDate" TEXT,
        "WhoAdded" TEXT,
        "ZIPCode" TEXT)"""
    )

    cursor.execute("""CREATE Table CitationTypeCodes (
     "Code" TEXT PRIMARY KEY,
     "Description" TEXT)"""
    )

    cursor.execute("""CREATE Table GeobaseAddressIDMaintenance (
     "IDNumberOfAddress" TEXT PRIMARY KEY,
     "AddressPrefix" TEXT,
     "Between" TEXT,
     "CityCode" TEXT,
     "CrossingStreetName" TEXT,
     "DirectionsNumber" TEXT, 
     "HouseNumber" TEXT,
     "IntersectionDisplayOverride" TEXT,
     "OccupancyNumber" TEXT,
     "OccupancyType" TEXT,
     "StreetAddress" TEXT,
     "StreetLocation" TEXT,
     "StreetName" TEXT,
     "StreetNamePostDirectional" TEXT,
     "StreetNamePostType" TEXT,
     "StreetNamePreDirectional" TEXT,
     "StreetNamePreType" TEXT,
     "SuffixAfterHouseNumber" TEXT,
     "TimeDateOfGisUpdate" TEXT,
     "UserDefinedXy" TEXT,
     "XCoordinate" TEXT,
     "XN" TEXT,
     "YCoordinate" TEXT,
     "ZIP" TEXT,
     "ZoneEa" TEXT,
     "ZoneEr" TEXT,
     "ZoneEs" TEXT,
     "ZoneEz" TEXT,
     "ZoneFa" TEXT,
     "ZoneFr" TEXT,
     "ZoneFs" TEXT,
     "ZoneFz" TEXT,
     "ZoneLa" TEXT,
     "ZoneLr" TEXT,
     "ZoneLs" TEXT,
     "ZoneLz" TEXT,
     "ZoneMa" TEXT,
     "ZoneMr" TEXT,
     "ZoneMs" TEXT,
     "ZoneMz" TEXT)"""
    )

    cursor.execute("""CREATE Table IncidentClearanceCodeTable (
     "ClearanceCode" TEXT PRIMARY KEY,
     "AgencyCode" TEXT,
     "DescriptionOfCode" TEXT,
     "GenerateWorkflowRecord" TEXT)"""
    )

    cursor.execute("""CREATE Table LawIncidentTable (
     "IncidentNumber" TEXT PRIMARY KEY,
     "AgencyCode" TEXT,
     "AreaLocationCode" TEXT,
     "City" TEXT, 
     "ClearanceCode" TEXT,
     "ComplainantNameNumber" TEXT,
     "ContactOrCaller" TEXT,
     "DateDispositionDeclared" TEXT,
     "Disposition" TEXT,
     "GeobaseAddressID" TEXT,
     "HowReceived" TEXT,
     "IncidentAddress" TEXT,
     "IncidentNature" TEXT,
     "JudicialStatus" TEXT, 
     "LongTermCallID" TEXT,
     "MiscNumber" TEXT,
     "OffenseAsObserved" TEXT,
     "OffenseAsTaken" TEXT,
     "OrigIncidentNumber" TEXT,
     "ReceivedBy" TEXT, 
     "RecordSecurityID" TEXT,
     "ResponsibleOfficer" TEXT, 
     "StateAbbreviation" TEXT,
     "TimeDateLastModified" TEXT,
     "TimeDateOccurredAfter" TEXT,
     "TimeDateOccurredBefore" TEXT,
     "TimeDateReported" TEXT,
     "UserWhoLastModified" TEXT,
     "ZIPCode" TEXT)"""
    )

    cursor.execute("""CREATE Table LawIncidentOffensesDetail (
     "StatuteCode" TEXT,
     "StatuteOther" TEXT,
     "SequenceNumber" TEXT,
     "OffenseCode" TEXT,
     "TimeDateLastModified" TEXT,
     "UserWhoLastModified" TEXT,
     "ArsonDamageAmount" TEXT,
     "IncidentNumber" TEXT, 
     Primary Key ("IncidentNumber", "StatuteCode", "OffenseCode", "SequenceNumber")
     )"""
    )

    cursor.execute("""CREATE Table Offender (
     "DetailRecordReferenceNumber" TEXT PRIMARY KEY,
     "AddressCity" TEXT, 
     "AddressOfOffender" TEXT,
     "AddressState" TEXT,
     "AddressZIPCode" TEXT,
     "AgeClass" TEXT,
     "AgeOfOffender" TEXT,
     "AgeRangeOfOffender" TEXT,
     "ArrestDate" TEXT,
     "BriefComments" TEXT,
     "CleryActionTaken" TEXT,
     "CleryDateLetterLastGenratd" TEXT,
     "CleryDateReferred" TEXT,
     "CleryLawViolation" TEXT,
     "CleryParentalNotification" TEXT,
     "CleryParentContact" TEXT,
     "Color1OfOffenderVehicle" TEXT,
     "Color2OfOffenderVehicle" TEXT,
     "CorrectionsIndicator" TEXT,
     "Disposition" TEXT,
     "DispositionDate" TEXT,
     "DvCardGivenToOffender" TEXT,
     "DvOffenderArrestedFor" TEXT,
     "DvRestrainingOrderViolated" TEXT,
     "Ethnicity" TEXT,
     "EyeColorOfOffender" TEXT,
     "FirstNameOfOffender" TEXT,
     "GangAffiliationCode" TEXT,
     "GeobaseAddressID" TEXT,
     "GuardianNameReference" TEXT,
     "GuardianToOffenderRelation" TEXT,
     "HairColorOfOffender" TEXT,
     "HeightOfOffender" TEXT,
     "HeightRangeOfOffender" TEXT,
     "HouseholdMemberStatusCode" TEXT,
     "IncidentReference" TEXT,
     "IsUseOfForceOffender" TEXT,
     "JuvenileOffenderDisposition" TEXT,
     "LastNameOfOffender" TEXT,
     "MiddleNameOfOffender" TEXT,
     "NameReference" TEXT,
     "OffenderCondition" TEXT,
     "OfndrPresentWhenOffcrsArvd" TEXT,
     "PersonType" TEXT,
     "Race" TEXT,
     "ReasonOffenderNotArrested" TEXT,
     "RegisteredSexOffender" TEXT,
     "ReligionOfOffender" TEXT,
     "ResidentialStatus" TEXT,
     "RestrainingOrderEverIssued" TEXT,
     "RestrainingOrderForIncident" TEXT,
     "SequenceNumber" TEXT,
     "SexOfOffender" TEXT,
     "SuspectVehicleLicenseYear" TEXT,
     "TimeDateAdded" TEXT,
     "TimeDateRecordLastModified" TEXT,
     "TypeOfInjury" TEXT,
     "UserWhoAddedRecord" TEXT,
     "UserWhoLastModifiedRecord" TEXT,
     "VehicleLicenseNumber" TEXT,
     "VehicleLicenseState" TEXT,
     "VehicleReference" TEXT, 
     "VehicleStyle" TEXT,
     "VictimFlag" TEXT,
     "WantNumber" TEXT, 
     "WasOffenderArrested" TEXT,
     "WeightOfOffender" TEXT,
     "WeightRangeOfOffender" TEXT)"""
    )

    cursor.execute("""CREATE Table LawIncidentDispositionCodes (
     "DispositionCode" TEXT PRIMARY KEY,
     "InternalActionCode" TEXT,
     "CanBeUsedInCAD" TEXT,
     "Description" TEXT,
     "SendToMobile" TEXT)"""
    )

    cursor.execute("""CREATE Table Victim (
     "DetailRecordReferenceNumber" TEXT PRIMARY KEY,
     "AgeClass" TEXT,
     "AgeOfVictim" TEXT,
     "AgeRangeOfVictim" TEXT,
     "AssaultStatus" TEXT,
     "BodyArmor" TEXT,
     "CampusType" TEXT,
     "Classification" TEXT,
     "CounselingReferral" TEXT,
     "DomesticViolence" TEXT,
     "DomesticViolenceOffense" TEXT,
     "Dsa" TEXT,
     "DvCardGivenToVictim" TEXT,
     "DvChildrenPresentInvolved" TEXT,
     "DvCriminalNeglectIndicator" TEXT,
     "DvVictimDisabilityCode" TEXT,
     "DvVictimPregnantIndicator" TEXT,
     "DvWasCppCalled" TEXT,
     "Ethnicity" TEXT,
     "ExistPriorDiffBtwnParties" TEXT,
     "EyeColorOfVictim" TEXT,
     "FamilyViolenceIndicator" TEXT,
     "FinancialAssistanceReferral" TEXT,
     "FirstNameOfVictim" TEXT,
     "GangAffiliationCode" TEXT,
     "GuardianNameReference" TEXT,
     "GuardianToVictimRelation" TEXT,
     "HairColorOfVictim" TEXT,
     "HeightOfVictim" TEXT,
     "IncidentReference" TEXT,
     "IsUseOfForceVictim" TEXT,
     "JustifiableHomiCircumstance" TEXT,
     "LastNameOfVictim" TEXT,
     "LegalReferral" TEXT,
     "LeokaActivityType" TEXT,
     "LeokaActivityTypeExtended" TEXT,
     "LeokaAssignmentType" TEXT,
     "LeokaIncidentType" TEXT,
     "LevelOfInjury" TEXT,
     "MedicalReferral" TEXT,
     "MiddleNameOfVictim" TEXT,
     "NameReference" TEXT,
     "OffenderFlag" TEXT,
     "OriOtherJurisdictionOfficer" TEXT,
     "OtherReferral" TEXT,
     "PrevDomesticViolenceVictim" TEXT,
     "PrimaryVictim" TEXT,
     "PriorDomesticViolOffender" TEXT,
     "Race" TEXT,
     "ReligionOfVictim" TEXT,
     "ReportedBy" TEXT,
     "Resident" TEXT,
     "SchoolCode" TEXT,
     "SendToIbr" TEXT,
     "SeniorCitizenIndicator" TEXT,
     "SeniorElderWasAbused" TEXT,
     "SequenceNumber" TEXT,
     "SexOfVictim" TEXT,
     "ShelterReferral" TEXT,
     "TimeDateAdded" TEXT,
     "TimeDateRecordLastModified" TEXT,
     "Transportation" TEXT,
     "TypeOfVictim" TEXT,
     "UserWhoAddedRecord" TEXT,
     "UserWhoLastModifiedRecord" TEXT,
     "VictimMedicalTreatment" TEXT,
     "VictimRights" TEXT,
     "VictimSuspectedOfUsing" TEXT,
     "VictimUnderInfluence" TEXT,
     "ViolationOfOrderOfProtectn" TEXT,
     "ViolOfPersonalProtOrder" TEXT,
     "WasOfficerKilled" TEXT,
     "WasOfficerWearingVest" TEXT,
     "WasTheVictimHandicaped" TEXT,
     "WeaponOwnedBy" TEXT,
     "WeightOfVictim" TEXT,
     "WhetherVictApprisedOfRemed" TEXT)"""
    )

    cursor.execute("""CREATE Table MainNamesTable (
     "NameNumber" TEXT PRIMARY KEY,
     "UserWhoAddedRecord" TEXT,
     "TimeDateAdded" TEXT,
     "AliasNameNumber" TEXT,
     "BirthDate" TEXT,
     "Build" TEXT, 
     "CityOfResidence" TEXT, 
     "SkinComplexion" TEXT,
     "DeathDate" TEXT,
     "DriverLicenseNumber" TEXT,
     "DriverLicenseState" TEXT,
     "EthnicGroup" TEXT,
     "EyeColor" TEXT,
     "FacialHair" TEXT,
     "FBINumber" TEXT,
     "FirstName" TEXT,
     "Gender" TEXT,
     "GeobaseAddressID" TEXT,
     "GlassesCorrectiveLenses" TEXT,
     "HairColor" TEXT,
     "HairStyle" TEXT,
     "Height" TEXT,
     "LastName" TEXT,
     "MiddleName" TEXT,
     "UserWhoLastModifiedRecord" TEXT,
     "TimeDateRecordLastModified" TEXT,
     "NameType" TEXT,
     "HomePhoneNumber" TEXT,
     "RaceCategory" TEXT,
     "RealName" TEXT,
     "RecordSecurityID" TEXT,
     "Sex" TEXT,
     "SoundexName" TEXT,
     "SpeechType" TEXT,
     "SocSecNumber" TEXT,
     "StateAbbreviation" TEXT,
     "StateIDNumber" TEXT,
     "StreetAddress" TEXT,
     "SuffixName" TEXT,
     "TeethCondition" TEXT,
     "Weight" TEXT,
     "WorkTelephoneNumber" TEXT,
     "ZIPCode" TEXT,
     "Pronoun" TEXT)"""
    )

    cursor.execute("""CREATE Table EthnicTypeAbbreviations (
     "AbbreviationOfEthnic" TEXT PRIMARY KEY,
     "DescriptionOfEthnic" TEXT)"""
    )

    cursor.execute("""CREATE Table TableOfGenderCodes (
     "CodeAbbrOfGenderType" TEXT PRIMARY KEY,
     "DescriptionOfGenderType" TEXT)"""
    )

    cursor.execute("""CREATE Table NameTypeCodes (
     "NameType" TEXT PRIMARY KEY,
     "ActionCode" TEXT,
     "Description" TEXT)"""
    )

    cursor.execute("""CREATE Table TableOfRacialCodes (
     "CodeAbbrOfRacialType" TEXT PRIMARY KEY,
     "UcrActionCode" TEXT,
     "DescriptionOfRacialType" TEXT)"""
    )

    cursor.execute("""CREATE Table TableOfSexCodes (
     "CodeAbbrOfSexType" TEXT PRIMARY KEY,
     "DescriptionOfSexType" TEXT)"""
    )

    cursor.execute("""CREATE Table CrimeClassCodesTable (
     "Code" TEXT PRIMARY KEY,
     "ActionCode" TEXT,
     "Description" TEXT,
     "SeriousnessOfCrimeClass" TEXT)"""
    )

    cursor.execute("""CREATE Table HowReceivedCodes (
     "HowReceivedCode" TEXT PRIMARY KEY,
     "Description" TEXT)"""
    )

    cursor.execute("""CREATE Table StatuteCodesTable (
     "StatuteCode" TEXT PRIMARY KEY,
     "Adopts" TEXT,
     "AgencyCode" TEXT,
     "ArrestReportable" TEXT,
     "AttemptedCompleted" TEXT,
     "BookingRequired" TEXT,
     "CrimeAgainstChildren" TEXT,
     "CrimeAgainstSchoolPersonnel" TEXT,
     "Category" TEXT,
     "Chapter" TEXT,
     "CrimeClassification" TEXT,
     "Description" TEXT,
     "DiscontinuedDate" TEXT,
     "DomesticViolence" TEXT,
     "EffectiveDate" TEXT,
     "IncidentReportable" TEXT,
     "LawJurisdiction" TEXT,
     "MciCategory" TEXT,
     "Miscellaneous1" TEXT,
     "Miscellaneous2" TEXT,
     "Miscellaneous3" TEXT,
     "Miscellaneous4" TEXT,
     "NCICOffenseCode" TEXT,
     "OffenseCode" TEXT,
     "OffenseType" TEXT,
     "OtherUcrOffenseCode" TEXT,
     "Section" TEXT,
     "Severity" TEXT,
     "StateMasterCode" TEXT,
     "StateAbbreviationCode" TEXT,
     "SubCategory" TEXT,
     "SubSection1" TEXT,
     "SubSection2" TEXT,
     "SubSection3" TEXT,
     "SubSection4" TEXT,
     "SubSection5" TEXT,
     "Traffic" TEXT,
     "UcrOffenseCode" TEXT)"""
    )

    cursor.execute("""CREATE Table NatureOfCallTable (
     "NatureOfCall" TEXT PRIMARY KEY,
     "AgencyCode" TEXT,
     "AutomaticallyCreateIncident" TEXT,
     "CallTypeLawFireEMS" TEXT,
     "AdditionalDescription" TEXT,
     "ConditionCode" TEXT,
     "EMSNature" TEXT,
     "FireConditionCode" TEXT, 
     "FireNature" TEXT,
     "LawNature" TEXT,
     "SendToMobile" TEXT,
     "LawOffenseCode" TEXT,
     "DefaultPriority" TEXT,
     "LaunchProqa" TEXT,
      "LaunchCallProtocol" TEXT,
     "CheckSpecialInstructions" TEXT,
     "ArriveMinutesAllowedTo" TEXT,
     "AssignMinutesAllowedTo" TEXT,
     "CompleteMinutesAllowedTo" TEXT,
     "EnterMinutesAllowedTo" TEXT,
     "RespondMinutesAllowedTo" TEXT)"""
    )
    # CodeForOffense,OffenseDescription,RiskValue,UcrActionCode,AgencyCode
    cursor.execute("""CREATE Table OffenseCodes (
     "CodeForOffense" TEXT PRIMARY KEY,
     "UcrActionCode" TEXT,
     "AgencyCode" TEXT,
     "OffenseDescription" TEXT,
     "Priority" TEXT,
     "RiskValue" TEXT)"""
    )

    cursor.execute("""CREATE Table OffenseTypeTable (
     "OffenseTypeCode" TEXT PRIMARY KEY,
     "Description" TEXT)"""
    )

    cursor.execute("""CREATE Table ZoneCodeTable (
     "ZoneCode" TEXT PRIMARY KEY,
     "AgencyCode" TEXT,
     "DescriptionOfZone" TEXT,
     "DistrictCode" TEXT,
     "XCoordinateOfCenterOfZone" TEXT,
     "YCoordinateOfCenterOfZone" TEXT)"""
    )

    cursor.execute("""CREATE Table OffenseTranslation (
     "DetailReferenceNumber" TEXT PRIMARY KEY,
     "ArrestReportable" TEXT,
     "AttemptedCompleted" TEXT,
     "CrimeAgainstChildren" TEXT,
     "CrimeAgainstSchoolPersonnel" TEXT,
     "OffenseCode" TEXT,
     "DomesticViolence" TEXT,
     "IncidentReportable" TEXT,
     "MciCategory" TEXT,
     "NCICOffenseCode" TEXT,
     "OtherUcrOffenseCode" TEXT,
     "DetailSequenceNumber" TEXT,
     "StateAbbreviationCode" TEXT,
     "UcrOffenseCode" TEXT,
     "UcrOffenseCodeExtended" TEXT)"""
    )

    cursor.execute("""CREATE Table TrafficWarningTable (
     "TrafficWarningNumber" TEXT PRIMARY KEY,
     "LawIncident" TEXT,
     "UserWhoAddedRecord" TEXT,
     "TimeDateAdded" TEXT,
     "AgencyCode" TEXT,
     "City" TEXT, 
     "DateOfCitation" TEXT,
     "GeobaseAddressID" TEXT,
     "IssuingOfficer" TEXT, 
     "AreaLocationCode" TEXT,
     "UserWhoLastModifiedRecord" TEXT,
     "TimeDateRecordLastModified" TEXT,
     "NameNumber" TEXT,
     "RecordSecurityID" TEXT,
     "StateAbbreviation" TEXT,
     "StreetAddress" TEXT,
     "VehicleNumber" TEXT, 
     "ZIPCode" TEXT)"""
    )

    cursor.execute("""CREATE Table TrafficWarningOffenseDetail (
     "OffenseCode" TEXT PRIMARY KEY,
     "UserWhoLastModifiedRecord" TEXT,
     "TimeDateRecordLastModified" TEXT,
     "TrafficWarningNumber" TEXT,
     "SequenceNumber" TEXT)"""
    )

    cursor.execute("""CREATE Table TableOfCountiesAndAbbrs (
     "CountyCode" TEXT PRIMARY KEY,
     "FipsCode" TEXT,
     "County" TEXT)"""
    )

    cursor.execute("""CREATE Table CADAlarmCodeTable (
     "AlarmCode" TEXT PRIMARY KEY,
     "CallNature" TEXT,
     "ComplainantNameNumber" TEXT,
     "InfoForCall" TEXT,
     "GeobaseAddressID" TEXT,
     "DescriptionOfAlarm" TEXT,
     "PersonToContactPhone" TEXT,
     "ContactsName" TEXT,
     "CityCode" TEXT,
     "Location" TEXT)"""
    )

    cursor.execute("""CREATE Table PDeterminantCodes (
     "Code" TEXT PRIMARY KEY,
     "MeaningOfDeterminant" TEXT,
     "Code1" TEXT
     )""")

    cursor.execute("""CREATE Table TableOfInvolvements (
     "Alert" TEXT,
     "DateInvolvementOccurred" TEXT,
     "ParentInvlRecord" TEXT,
     "RecIDThisRecordsIDNo" TEXT,
     "RelIDRelatedRecordsID" TEXT,
     "RelationshipToOtherRecord" TEXT,
     "RtypeRelatedRecordsType" TEXT,
     "RecordSecurityID" TEXT,
     "SequenceNumber" TEXT,
     "TypeOfThisRecord" TEXT,
     Primary Key ("DateInvolvementOccurred", "RecIDThisRecordsIDNo", "RelIDRelatedRecordsID", "RecordSecurityID", "TypeOfThisRecord")
     )""")

    cursor.execute("""CREATE Table JailOffenseTable (
     "OffenseNumber" TEXT PRIMARY KEY,
     "Agency" TEXT,
     "AlcoholDrugInvolved" TEXT,
     "Area" TEXT,
     "CityOfOffense" TEXT,
     "Counts" TEXT,
     "CourtCode" TEXT,
     "CourtDocketNumber" TEXT,
     "CrimeClass" TEXT,
     "Disposition" TEXT,
     "DispositionDate" TEXT,
     "EntryCode" TEXT,
     "GeobaseAddressID" TEXT,
     "InmateNumber" TEXT,
     "JurisdictionOfOffense" TEXT,
     "LawIncidentNumber" TEXT,
     "Location" TEXT,
     "NCIC" TEXT,
     "OffenseCode" TEXT,
     "OffenseInchoate" TEXT, 
     "OffenseOin" TEXT,
     "OffenseType" TEXT,
     "ProsecutorAgency" TEXT,
     "RecordSecurityID" TEXT,
     "Reference" TEXT,
     "SentencedCrimeClass" TEXT,
     "SentencedDate" TEXT,
     "SentencedDisposition" TEXT,
     "SentencedOffenseType" TEXT,
     "SentencedOin" TEXT,
     "SentencedStatute" TEXT,
     "StateAbbreviation" TEXT,
     "Statute" TEXT,
     "StatuteOther" TEXT,
     "TimeDate" TEXT,
     "TimeDateAdded" TEXT,
     "TimeDateRecordLastModified" TEXT,
     "TnSuffix" TEXT,
     "UserWhoAddedRecord" TEXT,
     "UserWhoLastModifiedRecord" TEXT,
     "WarrantNumber" TEXT,
     "ZIPCode" TEXT)"""
    )

    cursor.execute("""CREATE Table JailOffenseDispositionCodes (
     "Code" TEXT PRIMARY KEY,
     "Action" TEXT,
     "TimeDateAdded" TEXT,
     "UserWhoAddedRecord" TEXT,
     "Description" TEXT,
     "TimeDateRecordLastModified" TEXT,
     "UserWhoLastModifiedRecord" TEXT)"""
    )

    cursor.execute("""CREATE Table OfficerRadioLogTable (
     "AgencyCode" TEXT,
     "LongTermCallID" TEXT,
     "OfficerRadioLogComments" TEXT,
     "UserWhoLoggedCall" TEXT,
     "TimeOfStatusChange" TEXT,
     "OfficerName" TEXT,
     "OfficerStatus" TEXT,
     "UnitStatus" TEXT,
     "UnitNumber" TEXT,
     "UnitZoneCode" TEXT,
     Primary Key ("LongTermCallID", "OfficerName", "UnitStatus", "TimeOfStatusChange")
     )""")

    cursor.execute("""CREATE Table OfficerStatusCodeTable (
     "OfficerStatus" TEXT PRIMARY KEY,
     "ActionCodeUnused" TEXT,
     "Available" TEXT,
     "Description" TEXT)"""
    )

    cursor.execute("""CREATE Table UnitStatusCodes10Codes (
     "Code" TEXT PRIMARY KEY,
     "ActionCode" TEXT,
     "MinutesAllowedForAction" TEXT,
     "IsUnitAvailable" TEXT,
     "MeaningOf10Code" TEXT,
     "DriveTimeDelayInMinutes" TEXT,
     "SendToMobile" TEXT,
     "TranslateToPrimaryDef" TEXT)"""
    )

    cursor.execute("""CREATE Table CallTypeAggregationFile (
                        "Nature" TEXT,
                        "CallType" TEXT)""")

    cursor.execute("""CREATE Table IncidentAggregationFile (
                        "IncidentNature" TEXT,
                        "IncidentType" TEXT)""")

    cursor.execute("""CREATE Table LocalOffenseDescriptionToNIBRSCodes (
                        "LocalOffenseDescription" TEXT,
                        "NIBRSCode" TEXT)""")

    cursor.execute("""CREATE Table NIBRSOffenseCodes (
                        "NIBRSOffenseCategory TEXT",
                        "NIBRSOffense" TEXT,
                        "NIBRSOffenseCode" TEXT,
                        "NIBRSCrimeAgainst" TEXT,
                        "NIBRSOffenseGroup" TEXT,
                        "UCRParts" TEXT,
                        "ViolentCrime" TEXT,
                        "PropertyCrime" TEXT,
                        "CrimeType" TEXT,
                        "CrimeCategory" TEXT)""")

    # Close the connection
    conn.close()
