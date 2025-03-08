import CustomAccordionSummary from '@/components/CustomAccordionSummary';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import Link from '@/components/Link';
import { Accordion, AccordionDetails, Box, Typography } from '@mui/material';

export default function CrimeFAQ() {
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
              <strong>Arrest:</strong> Occurs when police officers either issues a “Citation and Notice” form or takes a
              suspect into custody.
            </Typography>
            <Typography paragraph>
              <strong>Crime:</strong> Reported incidents with violations of law.
            </Typography>
            <Typography paragraph>
              <strong>Crime Rate over Time:</strong> This is a calculation of reported crimes in Hazel Crest, IL per
              1,000 people.
            </Typography>
            <Typography paragraph>
              <strong>Crime Types:</strong> The Hazel Crest Police Department’s local offense codes were mapped to codes
              used in the National Incident-Based Reporting System (NIBRS) for law enforcement agencies. For ease of use
              and understanding for residents, each of these crime types is assigned one of the following six groups
              (Disorderly Conduct, Financial Crimes, Physical or Sexual Violence, Property and Theft-Related Crimes,
              Substance-related Crimes, Other Crimes) for the visualizations on this website. Please refer to the{' '}
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
            <Typography paragraph>
              <strong>Historical Activity:</strong> Refers to past years for which data is available. Please note data
              availability and completeness varies by year.
            </Typography>

            <Typography paragraph>
              <strong>Incident Number:</strong> A unique identifier for incident records.
            </Typography>

            <Typography paragraph>
              <strong>Nature of Incident:</strong> Additional details about an incident logged by the police officer.
            </Typography>

            <Typography paragraph>
              <strong>Offender:</strong> Person accused or suspected of being responsible of a crime.
            </Typography>

            <Typography paragraph>
              <strong>Outcome:</strong> The last reported status of an incident. This is also referred to as a
              disposition. A police report disposition is a code that indicates the status of a case. View more
              information on disposition types below:
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Cleared by Adult Arrest:</strong> An officer has taken an individual aged 18 years or older into
                custody and no further follow-up is needed.
              </Typography>
              <Typography component="li">
                <strong>Cleared by Juvenile Arrest:</strong> An officer has taken an individual aged younger than 18
                years into custody and no further follow-up is needed.
              </Typography>
              <Typography component="li">
                <strong>Pending Investigation:</strong> The case is active and requires additional action or follow-up.
                Law enforcement may be conducting additional investigations, future hearings may be scheduled, and no
                final determination has been made in the case.
              </Typography>
              <Typography component="li">
                <strong>Closed Administratively:</strong> Cases that do not require any follow-up.
              </Typography>
              <Typography component="li">
                <strong>Inactive:</strong> Criminal cases in which there are no leads.
              </Typography>
              <Typography component="li">
                <strong>Information Only: </strong> A police report is taken for documentation purposes.
              </Typography>
            </Box>

            <Typography paragraph>
              <strong>Recent Activity:</strong> Refers to the most recent day (12:00am to 11:59pm CT) for which data is
              available.
            </Typography>

            <Typography paragraph>
              <strong>Victim:</strong> A person who has suffered physical, emotional, or financial harm as a result of a
              crime.
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
              <strong>How was the crime rate over time calculated?</strong> The crime rate per 1,000 people is
              calculated using the number of crimes reported in Hazel Crest, IL per 1,000 people for the most recent 12
              months and then estimating what the crime rate would be for a full year based on the prior 12 months. This
              is also referred to as a trailing 12-month annualized crime rate. This method provides a more current view
              of crime trends than just looking at the previous calendar year, allowing for more timely adjustments in
              crime prevention and law enforcement strategies.
            </Typography>

            <Typography paragraph>
              <strong>How were the crime type categories created?</strong> The Hazel Crest Police Department’s local
              offense codes were mapped to codes used in the National Incident-Based Reporting System (NIBRS) for law
              enforcement agencies. For ease of use and understanding for residents, each of these crime types is
              assigned one of the following six groups (Disorderly Conduct, Financial Crimes, Physical or Sexual
              Violence, Property and Theft-Related Crimes, Substance-related Crimes, Other Crimes) for the
              visualizations on this website. Please refer to the{' '}
              <Link href="https://ucr.fbi.gov/nibrs/2012/resources/a-guide-to-understanding-nibrs?bcs-agent-scanner=69bf14dc-e7cf-7645-b836-a8480f3a1216">
                Guide to Understanding NIBRS
              </Link>{' '}
              website for more information.
            </Typography>

            <Typography paragraph>
              <strong>What data sources were used to generate this page?</strong> This page uses available data from
              Hazel Crest’s E-COM 9-1-1 database via the Data for Community Trust Extract, Transform, Load (ETL) Data
              Pipeline. The visualizations are based on the derived tables listed below. Data available for download is
              from 2006 onwards.
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
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 3 }}>
          <CustomAccordionSummary text="More FAQs" aria-controls="panel3a-content" id="panel3a-header" />
          <AccordionDetails>
            <Typography gutterBottom>
              <strong>Where can I access historical crime data prior to 2019?</strong>
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
