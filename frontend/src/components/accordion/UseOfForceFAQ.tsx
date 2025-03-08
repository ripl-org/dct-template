import CustomAccordionSummary from '@/components/CustomAccordionSummary';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import { USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE } from '@/constants/useOfForce';
import { Accordion, AccordionDetails, Box, Typography } from '@mui/material';

export default function UseOfForceFAQ() {
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
              <strong>Conducted Energy Weapons (CEW):</strong> The use of a battery-powered, handheld device that uses
              electricity to temporarily incapacitate a person. CEWs are also known as tasers or stun guns and are a
              less-lethal alternative to firearms.
            </Typography>
            <Typography paragraph>
              <strong>Deadly Force:</strong> Any action which is likely to cause great bodily harm, including the firing
              of a firearm in the direction of a person, even if there is no intent to kill or inflict great bodily
              harm.
            </Typography>
            <Typography paragraph>
              <strong>Incident Number:</strong> A unique identifier for incident records.
            </Typography>
            <Typography paragraph>
              <strong>Intermediate Weapon:</strong> A weapon which is used to bridge the gap between empty-hand control
              methods/techniques and the use of deadly force. Intermediate weapons can include pepper spray or batons.
            </Typography>
            <Typography paragraph>
              <strong>Juvenile:</strong> Any person under the age of 18.
            </Typography>
            <Typography paragraph>
              <strong>Officer Initiated Call:</strong> An incident reported by a police officer based on their
              observations or assignment.
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
                <strong>Information Only:</strong> A police report is taken for documentation purposes.
              </Typography>
            </Box>
            <Typography paragraph>
              <strong>Physical Force:</strong> Any use or force which causes an injury to a person which results in
              medical treatment, or the use of intermediate weapons other than CEWs. Intermediate weapons can include
              pepper spray or batons.
            </Typography>
            <Typography paragraph>
              <strong>Recent Activity:</strong> For use of force, data is not available in a digital format to provide
              daily updates about Use of Force incidents in Hazel Crest, IL. Data available for this website was
              provided by the Hazel Crest Police Department in a static report of Use of Force incidents from January 1,
              2020 onwards. This data was last updated on {USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE}.
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
              data provided by Hazel Crest Police Department in static reports containing details about use of force
              incidents since January 1, 2020. This data was last updated on{' '}
              {USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE}.
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
