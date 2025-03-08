import { sendEvent } from '@/lib/gtag';
import { ExpandMore } from '@mui/icons-material';
import { AccordionSummary, Typography } from '@mui/material';

function CustomAccordionSummary(props: { text: string; 'aria-controls': string; id: string }) {
  return (
    <AccordionSummary
      onClick={() =>
        sendEvent('faqs_accordions', {
          target: props.text,
        })
      }
      expandIcon={
        <ExpandMore
          sx={{
            color: (theme) => theme.palette.green.main,
          }}
        />
      }
      aria-controls={props['aria-controls']}
      id={props.id}
      sx={{
        '&:hover': {
          '& .MuiSvgIcon-root': {
            color: 'green.dark',
          },
          '& .MuiAccordionSummary-content': {
            '& h3': {
              color: 'green.dark',
            },
            color: 'green.dark',
            textDecoration: 'underline',
          },
        },
        '&:focus': {
          '& .MuiSvgIcon-root': {
            color: 'green.dark',
          },
          '& .MuiAccordionSummary-content': {
            '& h3': {
              color: 'green.dark',
            },
            color: 'green.dark',
          },
        },
      }}
    >
      <Typography component="h3" variant="h6" fontWeight="bold" color="green.main">
        {props.text}
      </Typography>
    </AccordionSummary>
  );
}

export default CustomAccordionSummary;
