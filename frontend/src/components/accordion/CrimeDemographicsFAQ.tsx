import CustomAccordionSummary from '@/components/CustomAccordionSummary';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import Link from '@/components/Link';
import { Accordion, AccordionDetails, Box, Typography } from '@mui/material';

export default function CrimeDemographicsFAQ() {
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
              <strong>Age:</strong> Age is recorded as it is indicated on a driver’s license or government issued form
              of identification.
            </Typography>

            <Typography paragraph>
              <strong>Arrest:</strong> Occurs when police officers either issues a “Citation and Notice” form or takes a
              suspect into custody.
            </Typography>

            <Typography paragraph>
              <strong>Crime:</strong> Reported incidents with violations of law.
            </Typography>

            <Typography paragraph>
              <strong>Historical Activity:</strong> Refers to past years for which data is available. Please note data
              availability and completeness varies by year.
            </Typography>

            <Typography paragraph>
              <strong>Offender:</strong> Person accused or suspected of being responsible of a crime.
            </Typography>

            <Typography paragraph>
              <strong>Race:</strong> Race is recorded as a public safety professional’s perception. Ethnicity is not
              used in the reports.
            </Typography>

            <Typography paragraph>
              <strong>Sex:</strong> Sex is recorded as it is indicated on a driver’s license or government issued form
              of identification. Gender is not used in the reports.
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
              <strong>What data sources were used to generate this page?</strong> This page uses available data from
              Hazel Crest’s E-COM 9-1-1 database via the Data for Community Trust Extract, Transform, Load (ETL) Data
              Pipeline. The visualizations are based on the derived tables listed below. Data available for download is
              from 2006 onwards.
            </Typography>
            <Box component="ul">
              <Typography component="li">
                <strong>Offender:</strong> Demographics information related to reported offenders.
              </Typography>
              <Typography component="li">
                <strong>Victim:</strong> Demographics information related to reported victims of crime.
              </Typography>
              <Typography component="li">
                <strong>Arrests: </strong> Demographics information related to arrested offenders.
              </Typography>
            </Box>

            <Typography paragraph>
              <strong>How were the general demographics displayed for victims, offenders, and arrests recorded?</strong>
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

            <Typography paragraph>
              <strong>How can I find more information about what data is suppressed?</strong> Please refer to the{' '}
              <Link href="/privacy-policy">Privacy Policy</Link>, where you can find additional information about how
              data is handled.
            </Typography>
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
