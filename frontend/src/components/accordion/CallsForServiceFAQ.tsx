import CustomAccordionSummary from '@/components/CustomAccordionSummary';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import { Accordion, AccordionDetails, Box, Typography } from '@mui/material';

export default function CallsForServiceFAQ() {
  return (
    <InsetBoxContainer>
      <Box>
        <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 3 }}>
          FAQs
        </Typography>

        <Accordion disableGutters sx={{ mb: 3 }}>
          <CustomAccordionSummary
            text="What do the terms on this page mean?"
            aria-controls="panel1a-content"
            id="panel1a-header"
          />

          <AccordionDetails>
            <Typography paragraph>
              <strong>Average Response Time:</strong> The number of minutes, on average, between when a dispatcher logs
              a call and when the first officer arrives on scene.
            </Typography>
            <Typography paragraph>
              <strong>Average Time on Scene:</strong> The number of minutes, on average, spent by responding police
              officers on the scene of an incident.
            </Typography>
            <Typography paragraph>
              <strong>Call Priority Levels:</strong>
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>1-Critical:</strong> Events that are in progress where persons or high-value property are in
                immediate danger. Requires a multiple unit response or multiple groups of officers.
              </Typography>
              <Typography component="li">
                <strong>2-High:</strong> Not in progress and requires one officer, dispatched on the radio.
              </Typography>
              <Typography component="li">
                <strong>3-Medium:</strong> Not in progress and requires one officer, silently dispatched to the officer
                through the Computer Aided Dispatch (CAD) system.
              </Typography>
              <Typography component="li">
                <strong>4-Low:</strong> Not in progress and requires one officer, silently dispatched to the officer
                through the CAD system, and may be held for an available unit with command staff approval.
              </Typography>
            </Box>
            <Typography paragraph>
              <strong>Call Types:</strong> The raw available data from the Hazel Crest Police Department includes over
              400 different call types that are assigned by the dispatcher based on the call&apos;s preliminary nature.
              For ease of use and understanding for residents, each of these call types is assigned one of the following
              seven groups for the visualizations on this website.
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
            <Typography paragraph>
              <strong>Calls for service:</strong> A request for police assistance that resulted in a police response.
              Most calls for service originate when a resident dials an emergency number such as 911 or a nonemergency
              number for the local police department. Other calls for service can originate from police officers or
              alarms. The calls for service displayed on this website are those that resulted in a police response.
            </Typography>
            <Typography paragraph>
              <strong>Historical Activity:</strong> Refers to past years for which data is available. Please note data
              availability and completeness varies by year.
            </Typography>
            <Typography paragraph>
              <strong>Incident Number:</strong> Unique identifier for incident records.
            </Typography>
            <Typography paragraph>
              <strong>Recent Activity:</strong> Refers to the most recent day (12:00am to 11:59pm CT) for which data is
              available.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 3 }}>
          <CustomAccordionSummary
            text="Where did the data on this page come from?"
            aria-controls="panel2a-content"
            id="panel2a-header"
          />

          <AccordionDetails>
            <Typography paragraph>
              <strong>How was the average response time by call priority calculated?</strong> The average response time
              is calculated by filtering calls for service received by the Hazel Crest Police Department in person, by
              911, or by telephone that required a police response. The time each incident&apos;s first responding
              officer arrives on scene is determined, then subtracted from the time the call was originally logged. This
              difference gives the response time for each incident. The average response time by call priority is then
              obtained by grouping by call priority and calculating the median of these individual response times across
              all incidents.
            </Typography>

            <Typography paragraph>
              <strong>How was the average time on scene by call priority calculated?</strong> The average time on scene
              is calculated by taking the time logged by officers when they arrive on scene and subtracting that from
              the time they mark themselves off the scene. The average time on scene by call priority is then obtained
              by grouping by call priority and calculating the median of the time on scene across incidents.
            </Typography>

            <Typography paragraph>
              <strong>How was the average time on scene by call type calculated?</strong> The average time on scene is
              calculated by taking the time logged by officers when they arrive on scene and subtracting that from the
              time they mark themselves off the scene. The average time on scene by call type is then obtained by
              grouping by call type and calculating the median of the time on scene across incidents.
            </Typography>

            <Typography paragraph>
              <strong>How were the call type categories created?</strong> The time on scene is calculated based on the
              time logged by officers when they arrive on scene and when they mark themselves off the scene. This total
              time is then divided by the number of incidents in a given year to display the average.
            </Typography>

            <Typography paragraph>
              <strong>What data sources were used to generate this page?</strong> This page uses available data from
              Hazel Crest’s E-COM 9-1-1 database via the Data for Community Trust Extract, Transform, Load (ETL) Data
              Pipeline. The visualizations are based on the derived tables listed below. Data available for download is
              from 2005 onwards.
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
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 3 }}>
          <CustomAccordionSummary text="More FAQs" aria-controls="panel3a-content" id="panel3a-header" />

          <AccordionDetails>
            <Typography gutterBottom>
              <strong>Where can I access historical calls for service data prior to 2019?</strong>
            </Typography>

            <Typography paragraph>
              There is an option to download all available data at both the top and bottom of the page.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </InsetBoxContainer>
  );
}
