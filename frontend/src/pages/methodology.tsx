import { Box, Typography, useMediaQuery, type Theme } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';

import DataPageHeader from '@/components/DataPageHeader';
import OffsetHashedSection from '@/components/OffsetHashedSection';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import Link from '@/components/Link';
import SectionColoredDivider from '@/components/SectionColoredDivider';
import { USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE } from '@/constants/useOfForce';

function MethodologyPage() {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Head>
        <title>Methodology | Data for Community Trust</title>
      </Head>

      <DataPageHeader title="Methodology" year="2005" description="" />

      <Box sx={{ mb: { xs: 4, md: 6 } }} />

      <OffsetHashedSection id="historical-activity">
        <InsetBoxContainer>
          <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
            Table of Contents
          </Typography>
          <Box component="ul" my={0} py={2}>
            <Typography component="li">
              <Link href="#hazel-crest-zone">Hazel Crest Zone Information</Link>
            </Typography>
            <Typography component="li">
              <Link href="#data-sources">Data Sources and Collection</Link>
            </Typography>
            <Typography component="li">
              <Link href="#data-cleaning">Data Cleaning and Processing</Link>
            </Typography>
            <Typography component="li">
              <Link href="#handling-missing-data">Handling of Missing or Incomplete Data</Link>
            </Typography>
            <Typography component="li">
              <Link href="#data-analysis">Data Analysis</Link>
            </Typography>
            <Typography component="li">
              <Link href="#data-visualization">Data Visualization</Link>
            </Typography>
            <Typography component="li">
              <Link href="#data-limitations">Data Limitations</Link>
            </Typography>
            <Typography component="li">
              <Link href="#glossary">Complete Glossary of Terms</Link>
            </Typography>
            <Typography component="li">
              <Link href="#sources">Sources</Link>
            </Typography>
          </Box>
        </InsetBoxContainer>

        <SectionColoredDivider />

        <OffsetHashedSection id="hazel-crest-zone">
          <InsetBoxContainer>
            <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              Hazel Crest Zone Information
            </Typography>
            <Typography variant="body1" mb={1}>
              The subdivisions and neighborhoods that make up the Village of Hazel Crest are divided into three zones.
              Please see the zone breakdown below.
            </Typography>
            <Typography variant="body1" mb={1}>
              <strong>Zone 1:</strong> Hazel Crest Proper
            </Typography>
            <Typography variant="body1" mb={1}>
              <strong>Zone 2:</strong> Twin Creeks, Pottawattamie Hills, Highlands, Appletree, English Valley
            </Typography>
            <Typography variant="body1" mb={1}>
              <strong>Zone 3:</strong> Pace Setter, Stonebridge, Carriage Hills, Chateaux, Stone Creek, Village West,
              Dynasty Lakes
            </Typography>
            <Typography variant="body1" mb={2}>
              The following map shows the zone sub-divisions.
            </Typography>
            <Image
              src="/assets/images/hazel-crest-zone.jpg"
              alt="Map of Hazel Crest Zones"
              width={isMobile ? 320 : 600}
              height={isMobile ? 275 : 516}
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: 720,
              }}
            />
          </InsetBoxContainer>
        </OffsetHashedSection>

        <SectionColoredDivider />

        <OffsetHashedSection id="data-sources">
          <InsetBoxContainer>
            <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              Data Sources and Collection
            </Typography>
            <Typography variant="body1">
              Available data supporting this website comes from Hazel Crest’s E-COM 9-1-1 Dispatch Center. This data is
              collected using Motorola’s Flex Data Exchange Application Programming Interface (API) and processed for
              the website via the Data for Community Trust Pipeline which runs an Extract, Transform, Load (ETL) process
              on the raw data to support visualizations on the website. The data pipeline automatically refreshes each
              night at 12:00AM Central Time (CT) and takes roughly 11 minutes to run.
            </Typography>
            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Calls for Service Data
            </Typography>
            <Typography variant="body1">
              Calls for Service visualizations use available data from Hazel Crest’s E-COM 9-1-1 database via the Data
              for Community Trust Extract, Transform, Load (ETL) Data Pipeline. The visualizations are based on the
              derived tables listed below. Data available for download is from 2005 onwards.
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Calls for Service:</strong> Location information and additional details for dispatched calls.
              </Typography>
              <Typography component="li">
                <strong>Incidents:</strong> Location information and additional details for incidents.
              </Typography>
              <Typography component="li">
                <strong>Officer Radio Log:</strong> Time stamped records of communication between dispatch and officers.
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 700, pt: { xs: 1, md: 2 } }} mb={0.5}>
              Average Response Time by Call Priority
            </Typography>
            <Typography variant="body1">
              The average response time is calculated by filtering calls for service received by the Hazel Crest Police
              Department in person, by 911, or by telephone that required a police response. The time each
              incident&apos;s first responding officer arrives on scene is determined, then subtracted from the time the
              call was originally logged. This difference gives the response time for each incident. The average
              response time by call priority is then obtained by grouping by call priority and calculating the median of
              these individual response times across all incidents.
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, pt: { xs: 1, md: 2 } }} mb={0.5}>
              Average Time on Scene by Call Priority
            </Typography>
            <Typography variant="body1">
              The average time on scene is calculated by taking the time logged by officers when they arrive on scene
              and subtracting that from the time they mark themselves off the scene. The average time on scene by call
              priority is then obtained by grouping by call priority and calculating the median of the time on scene
              across incidents.
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, pt: { xs: 1, md: 2 } }} mb={0.5}>
              Average Time on Scene by Call Type
            </Typography>
            <Typography variant="body1">
              The average time on scene is calculated by taking the time logged by officers when they arrive on scene
              and subtracting that from the time they mark themselves off the scene. The average time on scene by call
              type is then obtained by grouping by call type and calculating the median of the time on scene across
              incidents.
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, pt: { xs: 1, md: 2 } }} mb={0.5}>
              Calls for Service Type Categorization
            </Typography>
            <Typography variant="body1">
              The raw data from the Hazel Crest Police Department includes over 400 different call types that are
              assigned by the dispatcher based on the call&apos;s preliminary nature. For ease of use and understanding
              for residents, each of these call types is assigned one of the following seven groups for the
              visualizations on this website.
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Alarm:</strong> Calls initiated by the activation of an alarm of a vehicle, residence, business,
                or other premise.
              </Typography>
              <Typography component="li">
                <strong>Assist:</strong> Calls for medical or fire first-responders and other partner agencies and
                community responders such as social services.
              </Typography>
              <Typography component="li">
                <strong>Civil:</strong> Calls related to non-criminal matters where police presence is requested to
                ensure the situation does not escalate such as domestic disturbance, missing person, or dispute.
              </Typography>
              <Typography component="li">
                <strong>Crime:</strong> Calls related to activity that may be defined as criminal such as assault,
                battery, or burglary.
              </Typography>
              <Typography component="li">
                <strong>Disorder:</strong> Calls related to disturbances that require a police response to assess and
                resolve the situation such as suspicious auto, disturbance, or noise complaint.
              </Typography>
              <Typography component="li">
                <strong>Traffic:</strong> Calls related to motor vehicle collisions, road hazards, impaired drivers, or
                traffic stops.
              </Typography>
              <Typography component="li">
                <strong>Other:</strong> Calls that do not fall under other categories such as a 911 hangup, request to
                speak to an officer, or locked out of residence. Includes follow-up activities for prior calls and
                administrative activities.
              </Typography>
            </Box>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Crime Data
            </Typography>
            <Typography variant="body1">
              Crime visualizations uses available data from Hazel Crest’s E-COM 9-1-1 database via the Data for
              Community Trust Extract, Transform, Load (ETL) Data Pipeline. The visualizations are based on the derived
              tables listed below. Data available for download is from 2006 onwards.
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Offense:</strong> Location information and additional details about crime-related offenses.
              </Typography>
              <Typography component="li">
                <strong>Crime Rate:</strong> Trailing 12-month calculations for crime rate per 1,000 people.
              </Typography>
              <Typography component="li">
                <strong>Offender:</strong> Demographics information related to reported offenders.
              </Typography>
              <Typography component="li">
                <strong>Victim:</strong> Demographics information related to reported victims of crime.
              </Typography>
              <Typography component="li">
                <strong>Arrests:</strong> Demographics information related to arrested offenders.
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ fontWeight: 700, pt: { xs: 1, md: 2 } }} mb={0.5}>
              Crime Rate Over Time
            </Typography>
            <Typography variant="body1">
              The crime rate per 1,00 people is calculated using the number of crimes reported in Hazel Crest, IL per
              1,000 people for the most recent 12 months and then estimating what the crime rate would be for a full
              year based on the prior 12 months. This is also referred to as a trailing 12-month annualized crime rate.
              This method provides a more current view of crime trends than just looking at the previous calendar year,
              allowing for more timely adjustments in crime prevention and law enforcement strategies.
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 700, pt: { xs: 1, md: 2 } }} mb={0.5}>
              Crime Type Categorization
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: isMobile ? 'break-all' : 'normal' }}>
              The Hazel Crest Police Department’s local offense codes were mapped to codes used in the National
              Incident-Based Reporting System (NIBRS) for law enforcement agencies. For ease of use and understanding
              for residents, each of these crime types is assigned one of the following six groups (Disorderly Conduct,
              Financial Crimes, Physical or Sexual Violence, Property and Theft-Related Crimes, Substance-related
              Crimes, Other Crimes) for the visualizations on this website. Please refer to the{' '}
              <Link href="https://ucr.fbi.gov/nibrs/2012/resources/a-guide-to-understanding-nibrs?bcs-agent-scanner=69bf14dc-e7cf-7645-b836-a8480f3a1216">
                Guide to Understanding NIBRS
              </Link>{' '}
              website for more information.
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Disorderly Conduct:</strong> Behavior that disrupts public peace or decorum, disturbs other
                people or endangers public safety such as violating curfew, loitering, and vagrancy.
              </Typography>
              <Typography component="li">
                <strong>Financial Crimes:</strong> Activity by a person or group that involves fraudulent or dishonest
                behavior for personal financial gain such as bribery, counterfeiting, and embezzlement.
              </Typography>
              <Typography component="li">
                <strong>Physical or Sexual Violence:</strong> Assault or threats to inflict bodily harm or death on
                another person including assault, sexual assault, and rape.
              </Typography>
              <Typography component="li">
                <strong>Property and Theft-Related Crimes:</strong> The intentional destruction or defacement of
                property, or the unlawful taking of money or property, such as burglary, motor vehicle theft, and arson.
              </Typography>
              <Typography component="li">
                <strong>Substance-related Crimes:</strong> The possession, use, distribution, manufacture of illegal
                substances or drugs and offenses in which a substance’s influence contribute to an incident such as
                Driving under the influence (DUI) and drunkenness.
              </Typography>
              <Typography component="li">
                <strong>Other Crimes:</strong> Crimes that do not fall under the categories above such as animal
                cruelty, bond default and perjury.
              </Typography>
            </Box>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Crime Demographic Data
            </Typography>

            <Typography variant="body1">
              Crime visualizations uses available data from Hazel Crest’s E-COM 9-1-1 database via the Data for
              Community Trust Extract, Transform, Load (ETL) Data Pipeline. The visualizations are based on the derived
              tables listed below. Data available for download is from 2006 onwards.
            </Typography>

            <Box component="ul">
              <Typography component="li">
                <strong>Offender:</strong> Demographics information related to reported offenders.
              </Typography>
              <Typography component="li">
                <strong>Victim:</strong> Demographics information related to reported victims of crime.
              </Typography>
              <Typography component="li">
                <strong>Arrests:</strong> Demographics information related to arrested offenders.
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ fontWeight: 700, pt: { xs: 1, md: 2 } }} mb={0.5}>
              General Demographics
            </Typography>
            <Typography variant="body1">
              The following demographics are displayed for victims, offenders, and arrests.
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Race:</strong> Race is recorded as a public safety professional’s perception. Ethnicity is not
                used in the reports.
              </Typography>
              <Typography component="li">
                <strong>Sex:</strong> Sex is recorded as it is indicated on a driver’s license or government issued form
                of identification. Gender is not used in the reports.
              </Typography>
              <Typography component="li">
                <strong>Age:</strong> Age is recorded as it is indicated on a driver’s license or government issued form
                of identification.
              </Typography>
              <Typography component="li">
                For more information on the most recent census numbers, please visit the{' '}
                <Link href={'https://www.census.gov/quickfacts/hazelcrestvillageillinois'}>
                  United States Census Bureau QuickFacts website page for Hazel Crest Village, Illinois
                </Link>
                .
              </Typography>
            </Box>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Traffic Stops Data
            </Typography>
            <Typography variant="body1">
              The Traffic Stops page uses available data from the E-COM 9-1-1 database via the Data for Community Trust
              ETL (Extract, Transform, Load) Pipeline. The visualizations are based on the derived table ‘Traffic Stops’
              containing location information for traffic stops. Data available for download is from 2005 onwards.
            </Typography>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Use of Force Data
            </Typography>
            <Typography variant="body1">
              The Use of Force page uses available data provided by Hazel Crest Police Department in a static report
              containing details about use of force incidents from January 1, 2020 onwards. This data was last updated
              on {USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE}.
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              This dataset does not exist in the Spillman Flex System database, and so cannot be programmatically
              updated. Any data updates are directly collected from the Hazel Crest Police Department.
            </Typography>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Use of Force Demographic Data
            </Typography>
            <Typography variant="body1">
              The Use of Force page uses available data provided by Hazel Crest Police Department in a static report
              containing details about use of force incidents from January 1, 2020 onwards. This data was last updated
              on {USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE}.
            </Typography>
            <Typography variant="body1">
              This dataset does not exist in the Spillman Flex System database, and so cannot be programmatically
              updated. Any data updates are directly collected from the Hazel Crest Police Department.
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 700, pt: { xs: 1, md: 2 } }} mb={0.5}>
              General Demographics
            </Typography>
            <Typography variant="body1">
              The following demographics are displayed for civilians involved in use of force incidents.
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Race:</strong> Race is recorded as a public safety professional’s perception. Ethnicity is not
                used in the reports.
              </Typography>
              <Typography component="li">
                <strong>Sex:</strong> Sex is recorded as it is indicated on a driver’s license or government issued form
                of identification. Gender is not used in the reports.
              </Typography>
              <Typography component="li">
                <strong>Age:</strong> Age is recorded as it is indicated on a driver’s license or government issued form
                of identification.
              </Typography>
              <Typography component="li">
                For more information on the most recent census numbers, please visit the{' '}
                <Link href={'https://www.census.gov/quickfacts/hazelcrestvillageillinois'}>
                  United States Census Bureau QuickFacts website page for Hazel Crest Village, Illinois
                </Link>
                .
              </Typography>
            </Box>
          </InsetBoxContainer>
        </OffsetHashedSection>

        <SectionColoredDivider />

        <OffsetHashedSection id="data-cleaning">
          <InsetBoxContainer>
            <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              Data Cleaning and Processing
            </Typography>
            <Typography variant="body1">
              The following steps are taken to clean and process the raw available data to ensure they are in a
              consistent and usable format for use in visualizations in accordance with the{' '}
              <Link href="/privacy-policy">Privacy Policy</Link>
            </Typography>
            <Box component="ul">
              <Typography component="li">
                All datasets are structured to reduce redundant data and de-duplicated.
              </Typography>
              <Typography component="li">
                Multiple datasets are joined to one another on a case by case basis to support specific visualizations
                on the website.
              </Typography>
              <Typography component="li">
                All personal identifiable information (PII) is deidentified during the data extraction process.
              </Typography>
              <Typography component="li">
                Locations of domestic, medical, and mental health calls are removed from the data used for the website
                per the Privacy Principles.
              </Typography>
              <Typography component="li">
                All details regarding juveniles involved in any incidents are redacted to obscure sensitive information
                per the Privacy Principles.
              </Typography>
              <Typography component="li">
                Officer information is redacted to obscure identifiable information per the Privacy Principles.
              </Typography>
            </Box>
          </InsetBoxContainer>
        </OffsetHashedSection>

        <SectionColoredDivider />

        <OffsetHashedSection id="handling-missing-data">
          <InsetBoxContainer>
            <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              Handling of Missing or Incomplete Data
            </Typography>
            <Typography variant="body1">
              Limitations due to missing or incomplete data are annotated in the text alongside applicable
              visualizations. Where it is not possible to create visualizations due to missing data, this is indicated
              via statements in place of visualizations. Missing or incomplete data includes:
            </Typography>
            <Box component="ul">
              <Typography component="li">Latitude and longitude values for some reported incidents.</Typography>
              <Typography component="li">
                Demographic information for victims, offenders, arrests, and civilians involved in traffic stops and use
                of force incidents.
              </Typography>
              <Typography component="li">
                Details related to traffic stops such as reason for search and outcome data.
              </Typography>
            </Box>
          </InsetBoxContainer>
        </OffsetHashedSection>

        <SectionColoredDivider />

        <OffsetHashedSection id="data-analysis">
          <InsetBoxContainer>
            <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              Data Analysis
            </Typography>
            <Typography variant="body1">The following statistical methods are used:</Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Average:</strong> Calculating the central or typical value that represents the dataset by
                dividing the sum of values in the set by their number.
              </Typography>
              <Typography component="li">
                <strong>Counts:</strong> Tallying occurrences within the data, such as the number of times a particular
                event or characteristic appears.
              </Typography>
              <Typography component="li">
                <strong>Median:</strong> Identifying the middle value in a set of numbers.
              </Typography>
              <Typography component="li">
                <strong>Percent:</strong> Used to understand the relative size of a subgroup in comparison to a whole.
              </Typography>
              <Typography component="li">
                <strong>Rates:</strong> A measure expressed per unit (such as 1000 or per 100,000), to help in
                understanding the frequency or likelihood of events.
              </Typography>
            </Box>

            <Typography variant="body1">Analytical methods used:</Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Linear Regression:</strong> Applying a linear equation to observed data to predict the value of
                one variable based on the value of another variable. This helps in understanding the relationship
                between two variables.
              </Typography>
              <Typography component="li">
                <strong>Time Series Analysis:</strong> A series of data points ordered in time to identify patterns,
                trends, and seasonal variations.
              </Typography>
            </Box>

            <Typography variant="body1">Software or programming languages used:</Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>R and Python:</strong> Primary tools used to process, conduct statistical analysis, and create
                data sets to support the visualizations.
              </Typography>
            </Box>
          </InsetBoxContainer>
        </OffsetHashedSection>

        <SectionColoredDivider />

        <OffsetHashedSection id="data-visualization">
          <InsetBoxContainer>
            <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              Data Visualization
            </Typography>
            <Typography variant="body1">
              Custom front-end code and libraries are used to create and display data visualizations for the recent
              activity sections of the website, and for the Use of Force historical map and table visualizations. These
              libraries include:
            </Typography>
            <Box component="ul">
              <Typography component="li">Leaflet</Typography>
              <Typography component="li">Material to build User Interfaces (MUI)</Typography>
              <Typography component="li">ApexCharts.js</Typography>
            </Box>
            <Typography variant="body1">
              Tableau Public is used as the dominant tool to create and display data visualizations for historical data.
            </Typography>
          </InsetBoxContainer>
        </OffsetHashedSection>

        <SectionColoredDivider />

        <OffsetHashedSection id="data-limitations">
          <InsetBoxContainer>
            <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              Data Limitations
            </Typography>
            <Typography variant="body1">
              Data on this site represents available data that has been digitized by Hazel Crest Police Department. The
              police department may also keep paper records which are not reflected in the data or visualizations
              provided on the website.
            </Typography>
            <Box component="ul">
              <Typography component="li">
                Officers and administrators may sometimes go back to records and make updates/ changes. The data
                included on this site may not include all updates due to the potential lag in digitizing updated records
                and refreshing.
              </Typography>
              <Typography component="li">
                This website only displays reported crimes, which do not account for all crimes that take place.
              </Typography>
            </Box>
          </InsetBoxContainer>
        </OffsetHashedSection>

        <SectionColoredDivider />

        <OffsetHashedSection id="glossary">
          <InsetBoxContainer>
            <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              Complete Glossary of Terms
            </Typography>
            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              General Terms
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Age:</strong> Age is recorded as it is indicated on a driver’s license or government issued form
                of identification.
              </Typography>
              <Typography component="li">
                <strong>Historical Activity:</strong> Refers to past years for which data is available. Please note data
                availability and completeness varies by year.
              </Typography>
              <Typography component="li">
                <strong>Incident Number:</strong> A unique identifier for incident records.
              </Typography>
              <Typography component="li">
                <strong>Nature of Incident:</strong> Additional details about an incident logged by the police officer.
              </Typography>
              <Typography component="li">
                <strong>Race:</strong> Race is recorded as a public safety professional’s perception. Ethnicity is not
                used in the reports.
              </Typography>
              <Typography component="li">
                <strong>Recent Activity:</strong> Refers to the most recent day (12:00am to 11:59pm CT) for which data
                is available.
              </Typography>
              <Typography component="li">
                <strong>Sex:</strong> Sex is recorded as it is indicated on a driver’s license or government issued form
                of identification. Gender is not used in the reports.
              </Typography>
            </Box>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Calls for Service
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Average Response Time:</strong> The number of minutes, on average, between when a dispatcher
                logs a call and when the first officer arrives on scene.
              </Typography>
              <Typography component="li">
                <strong>Average Time on Scene:</strong> The number of minutes, on average, spent by responding police
                officers on the scene of an incident.
              </Typography>
              <Typography component="li">
                <strong>Call Priority Levels:</strong>
                <Box component="ul">
                  <Typography component="li">
                    <strong>1-Critical:</strong> Events that are in progress where persons or high-value property are in
                    immediate danger. Requires a multiple unit response or multiple groups of officers.
                  </Typography>
                  <Typography component="li">
                    <strong>2-High:</strong> Not in progress and requires one officer, dispatched on the radio.
                  </Typography>
                  <Typography component="li">
                    <strong>3-Medium:</strong> Not in progress and requires one officer, silently dispatched to the
                    officer through the Computer Aided Dispatch (CAD) system.
                  </Typography>
                  <Typography component="li">
                    <strong>4-Low:</strong> Not in progress and requires one officer, silently dispatched to the officer
                    through the CAD system, and may be held for an available unit with command staff approval.
                  </Typography>
                </Box>
              </Typography>

              <Typography component="li">
                <strong>Call Types:</strong> the raw available data from the Hazel Crest Police Department includes over
                400 different call types that are assigned by the dispatcher based on the call&apos;s preliminary
                nature. For ease of use and understanding for residents, each of these call types is assigned one of the
                following seven groups for the visualizations on this website.
                <Box component="ul">
                  <Typography component="li">
                    <strong>Alarm:</strong> Calls initiated by the activation of an alarm of a vehicle, residence,
                    business, or other premise.
                  </Typography>
                  <Typography component="li">
                    <strong>Assist:</strong> Calls for medical or fire first-responders and other partner agencies and
                    community responders such as social services.
                  </Typography>
                  <Typography component="li">
                    <strong>Civil:</strong> Calls related to non-criminal matters where police presence is requested to
                    ensure the situation does not escalate such as domestic disturbance, missing person, or dispute.
                  </Typography>
                  <Typography component="li">
                    <strong>Crime:</strong> Calls related to activity that may be defined as criminal such as assault,
                    battery, or burglary.
                  </Typography>
                  <Typography component="li">
                    <strong>Disorder:</strong> Calls related to disturbances that require a police response to assess
                    and resolve the situation such as suspicious auto, disturbance, or noise complaint.
                  </Typography>
                  <Typography component="li">
                    <strong>Traffic:</strong> Calls related to motor vehicle collisions, road hazards, impaired drivers,
                    or traffic stops.
                  </Typography>
                  <Typography component="li">
                    <strong>Other:</strong> Calls that do not fall under other categories such as a 911 hangup, request
                    to speak to an officer, or locked out of residence. Includes follow-up activities for prior calls
                    and administrative activities.
                  </Typography>
                </Box>
              </Typography>

              <Typography component="li">
                <strong>Calls for Service:</strong> A request for police assistance that resulted in a police response.
                Most calls for service originate when a resident dials an emergency number such as 911 or a nonemergency
                number for the local police department. Other calls for service can originate from police officers or
                alarms. The calls for service displayed on this website are those that resulted in a police response.
              </Typography>
            </Box>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Crime
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Arrest:</strong> Occurs when police officers either issues a “Citation and Notice” form or takes
                a suspect into custody.
              </Typography>
              <Typography component="li">
                <strong>Crime:</strong> Reported incidents with violations of law.
              </Typography>
              <Typography component="li">
                <strong>Crime Rate over Time:</strong> This is a calculation of reported crimes in Hazel Crest, IL per
                1,000 people.
              </Typography>
              <Typography component="li">
                <strong>Crime Types:</strong> The Hazel Crest Police Department’s local offense codes were mapped to
                codes used in the National Incident-Based Reporting System (NIBRS) for law enforcement agencies. For
                ease of use and understanding for residents, each of these crime types is assigned one of the following
                six groups (Disorderly Conduct, Financial Crimes, Physical or Sexual Violence, Property and
                Theft-Related Crimes, Substance-related Crimes, Other Crimes) for the visualizations on this website.
                Please refer to the{' '}
                <Link href="https://ucr.fbi.gov/nibrs/2012/resources/a-guide-to-understanding-nibrs?bcs-agent-scanner=69bf14dc-e7cf-7645-b836-a8480f3a1216">
                  Guide to Understanding NIBRS
                </Link>{' '}
                website for more information.
                <Box component="ul">
                  <Typography component="li">
                    <strong>Disorderly Conduct:</strong> Behavior that disrupts public peace or decorum, disturbs other
                    people or endangers public safety such as violating curfew, loitering, and vagrancy.
                  </Typography>
                  <Typography component="li">
                    <strong>Financial Crimes:</strong> Activity by a person or group that involves fraudulent or
                    dishonest behavior for personal financial gain such as bribery, counterfeiting, and embezzlement.
                  </Typography>
                  <Typography component="li">
                    <strong>Physical or Sexual Violence:</strong> Assault or threats to inflict bodily harm or death on
                    another person including assault, sexual assault, and rape.
                  </Typography>
                  <Typography component="li">
                    <strong>Property and Theft-Related Crimes:</strong> The intentional destruction or defacement of
                    property, or the unlawful taking of money or property, such as burglary, motor vehicle theft, and
                    arson.
                  </Typography>
                  <Typography component="li">
                    <strong>Substance-related Crimes:</strong> The possession, use, distribution, manufacture of illegal
                    substances or drugs and offenses in which a substance’s influence contribute to an incident such as
                    Driving under the influence (DUI) and drunkenness.
                  </Typography>
                  <Typography component="li">
                    <strong>Other Crimes:</strong> Crimes that do not fall under the categories above such as animal
                    cruelty, bond default and perjury.
                  </Typography>
                </Box>
              </Typography>
              <Typography component="li">
                <strong>Offender:</strong> Person accused or suspected of being responsible of a crime.
              </Typography>
              <Typography component="li">
                <strong>Outcome:</strong> The last reported status of an incident. This is also referred to as a
                disposition. A police report disposition is a code that indicates the status of a case. View more
                information on disposition types below:
                <Box component="ul">
                  <Typography component="li">
                    <strong>Cleared by Adult Arrest:</strong> An officer has taken an individual aged 18 years or older
                    into custody and no further follow-up is needed.
                  </Typography>
                  <Typography component="li">
                    <strong>Cleared by Juvenile Arrest:</strong> An officer has taken an individual aged younger than 18
                    years into custody and no further follow-up is needed.
                  </Typography>
                  <Typography component="li">
                    <strong>Pending Investigation:</strong> The case is active and requires additional action or
                    follow-up. Law enforcement may be conducting additional investigations, future hearings may be
                    scheduled, and no final determination has been made in the case.
                  </Typography>
                  <Typography component="li">
                    <strong>Closed Administratively:</strong> Cases that do not require any follow-up.
                  </Typography>
                  <Typography component="li">
                    <strong>Inactive:</strong> Criminal cases in which there are no leads.
                  </Typography>
                  <Typography component="li">
                    <strong>Information Only:</strong> A police report is taken for documentation purposes.
                  </Typography>
                </Box>
              </Typography>
              <Typography component="li">
                <strong>Victim:</strong> A person who has suffered physical, emotional, or financial harm as a result of
                a crime.
              </Typography>
            </Box>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Crime Demographics
            </Typography>
            <Box component="ul">
              <Typography component="li">See Crime Glossary and General Terms.</Typography>
            </Box>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Traffic Stops
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Traffic Stop:</strong> When a police officer temporarily detains a driver and their passengers
                to investigate a minor violation or potential crime. They are also known as being pulled over.
              </Typography>
            </Box>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Use of Force
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Conducted Energy Weapons (CEW):</strong> The use of a battery-powered, handheld device that uses
                electricity to temporarily incapacitate a person. CEWs are also known as tasers or stun guns and are a
                less-lethal alternative to firearms.
              </Typography>
              <Typography component="li">
                <strong>Deadly Force:</strong> Any action which is likely to cause great bodily harm, including the
                firing of a firearm in the direction of a person, even if there is no intent to kill or inflict great
                bodily harm.
              </Typography>
              <Typography component="li">
                <strong>Intermediate Weapon:</strong> A weapon which is used to bridge the gap between empty-hand
                control methods/techniques and the use of deadly force. Intermediate weapons can include pepper spray or
                batons.
              </Typography>
              <Typography component="li">
                <strong>Juvenile:</strong> Any person under the age of 18.
              </Typography>
              <Typography component="li">
                <strong>Officer Initiated Call:</strong> An incident reported by a police officer based on their
                observations or assignment.
              </Typography>
              <Typography component="li">
                <strong>Outcome:</strong> The last reported status of an incident. This is also referred to as a
                disposition. A police report disposition is a code that indicates the status of a case. View more
                information on disposition types below:
                <Box component="ul">
                  <Typography component="li">
                    <strong>Cleared by Adult Arrest:</strong> An officer has taken an individual aged 18 years or older
                    into custody and no further follow-up is needed.
                  </Typography>
                  <Typography component="li">
                    <strong>Cleared by Juvenile Arrest:</strong> An officer has taken an individual aged younger than 18
                    years into custody and no further follow-up is needed.
                  </Typography>
                  <Typography component="li">
                    <strong>Pending Investigation:</strong> The case is active and requires additional action or
                    follow-up. Law enforcement may be conducting additional investigations, future hearings may be
                    scheduled, and no final determination has been made in the case.
                  </Typography>
                  <Typography component="li">
                    <strong>Closed Administratively:</strong> Cases that do not require any follow-up.
                  </Typography>
                  <Typography component="li">
                    <strong>Inactive:</strong> Criminal cases in which there are no leads.
                  </Typography>
                  <Typography component="li">
                    <strong>Information Only:</strong> A police report is taken for documentation purposes.
                  </Typography>
                </Box>
              </Typography>
              <Typography component="li">
                <strong>Physical Force:</strong> Any use or force which causes an injury to a person which results in
                medical treatment, or the use of intermediate weapons other than CEWs. Intermediate weapons can include
                pepper spray or batons.
              </Typography>
              <Typography component="li">
                <strong>Recent Activity:</strong> For use of force, data is not available in a digital format to provide
                daily updates about Use of Force incidents in Hazel Crest, IL. Data available for this website was
                provided by the Hazel Crest Police Department in a static report of Use of Force incidents from January
                1, 2020 onwards. This data was last updated on {USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE}.
              </Typography>
              <Typography component="li">
                <strong>Use of Force:</strong> Incidents where police reported an “amount of effort” by police officers
                to compel compliance by an unwilling subject.
              </Typography>
            </Box>

            <Typography
              component="h3"
              variant="h6"
              color="primary.dark"
              fontWeight="bold"
              sx={{ lineHeight: 1.2, pt: { xs: 2, md: 3 } }}
              mb={0.5}
            >
              Use of Force Demographics
            </Typography>
            <Box component="ul">
              <Typography component="li">See Use of Force Glossary and General Terms.</Typography>
            </Box>
          </InsetBoxContainer>
        </OffsetHashedSection>

        <SectionColoredDivider />

        <OffsetHashedSection id="sources">
          <InsetBoxContainer>
            <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
              Sources
            </Typography>

            <Typography variant="body1" mb={1}>
              The following source was used to map the Hazel Crest Police Department’s local offense codes to codes used
              in the National Incident-Based Reporting System (NIBRS) for law enforcement agencies in the Crime page of
              this website.
            </Typography>

            <Box component="ul">
              <Typography component="li">
                Source: U.S. Department of Justice - Federal Bureau of Investigation, National Incident-Based Reporting
                System (NIBRS), A Guide to Understanding NIBRS,{' '}
                <Link
                  href="https://ucr.fbi.gov/nibrs/2012/resources"
                  sx={{ wordBreak: isMobile ? 'break-all' : 'normal' }}
                >
                  https://ucr.fbi.gov/nibrs/2012/resources
                </Link>
                .
              </Typography>
            </Box>

            <Typography variant="body1" mb={1}>
              The following source was used to provide the most recent census numbers for the Village of Hazel Crest,
              Illinois for the Crime Demographics and Use of Force Demographics page of this website.
            </Typography>

            <Box component="ul" mb={6}>
              <Typography component="li">
                Source: U.S. Census Bureau, QuickFacts-Hazel Crest Village, Illinois,{' '}
                <Link
                  href="https://www.census.gov/quickfacts/hazelcrestvillageillinois"
                  sx={{ wordBreak: isMobile ? 'break-all' : 'normal' }}
                >
                  https://www.census.gov/quickfacts/hazelcrestvillageillinois
                </Link>
                .
              </Typography>
            </Box>
          </InsetBoxContainer>
        </OffsetHashedSection>
      </OffsetHashedSection>
    </>
  );
}

export default MethodologyPage;
