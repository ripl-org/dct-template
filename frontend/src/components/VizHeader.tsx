import { Box, Typography } from '@mui/material';

function VizHeader(props: { title: string; subtitle?: string }) {
  return (
    <Box mb={1}>
      <Typography component="h3" variant="h6" fontWeight="bold" color="primary.dark">
        {props.title}
      </Typography>
      {props.subtitle && (
        <Typography variant="body2" fontStyle="italic">
          {props.subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default VizHeader;
