import CustomAccordionSummary from '@/components/CustomAccordionSummary';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import Link from '@/components/Link';
import { USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE } from '@/constants/useOfForce';
import { Accordion, AccordionDetails, Box, Typography } from '@mui/material';

export default function UseOfForceDemographicsFAQ() {
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
              <strong>Juvenile:</strong> Any person under the age of 18.
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
              <strong>Use of Force:</strong> Incidents where police reported an “amount of effort” by police officers to
              compel compliance by an unwilling subject.
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
              <strong>What data sources were used to generate this page?</strong> The Use of Force page uses available
              data provided by Hazel Crest Police Department in a static report containing details about use of force
              incidents since January 1, 2020. This data was last updated on{' '}
              {USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE}.
            </Typography>
            <Typography paragraph>
              <strong>
                How were the general demographics displayed for civilians involved in use of force incidents recorded?
              </strong>
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
              <strong>Where can I access all use of force data for Hazel Crest, IL?</strong>
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
