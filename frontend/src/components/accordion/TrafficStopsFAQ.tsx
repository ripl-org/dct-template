import CustomAccordionSummary from '@/components/CustomAccordionSummary';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import { Accordion, AccordionDetails, Box, Typography } from '@mui/material';

export default function TrafficStopsFAQ() {
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
              <strong>Historical Activity:</strong> Refers to past years for which data is available. Please note data
              availability and completeness varies by year.
            </Typography>
            <Typography paragraph>
              <strong>Incident Number:</strong> A unique identifier for incident records.
            </Typography>
            <Typography paragraph>
              <strong>Recent Activity:</strong> Refers to the closest day (12:00am to 11:59pm CT) to the present for
              which data is available.
            </Typography>
            <Typography paragraph>
              <strong>Traffic Stop:</strong> When a police officer temporarily detains a driver and their passengers to
              investigate a minor violation or potential crime. They are also known as being pulled over.
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
              <strong>What data sources were used to generate this page?</strong> The Traffic Stops page uses available
              data from the E-COM 9-1-1 database via the Data for Community Trust ETL (Extract, Transform, Load)
              Pipeline. The visualizations are based on the derived table ‘Traffic Stops’ containing location
              information for traffic stops. Data available for download is from 2005 onwards.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 3 }}>
          <CustomAccordionSummary text="More FAQs" aria-controls="panel3a-content" id="panel3a-header" />
          <AccordionDetails>
            <Typography gutterBottom>
              <strong>Where can I access historical traffic stops data prior to 2019?</strong>
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
