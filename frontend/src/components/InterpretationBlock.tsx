import { Box, type SxProps, type Theme, Typography, useMediaQuery } from '@mui/material';

interface InterpretationBlockProps {
  chartDescription?: string | React.ReactElement;
  dynamicText: React.ReactElement;
  dataQualifier?: string | React.ReactElement;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

function InterpretationBlock(props: InterpretationBlockProps) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  return (
    <Box
      sx={[
        // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row', gap: isMobile ? 16 : 24 },
        }}
      >
        {/* Left Column */}
        <Box sx={{ flex: { xs: 'none', md: '0 0 320px' } }}>
          <Box
            p={2}
            bgcolor="primary.light"
            height="100%"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <Box>{props.dynamicText}</Box>

            {Boolean(props.chartDescription && !isMobile) && (
              <Typography variant="body1">{props.chartDescription}</Typography>
            )}

            {!isMobile && Boolean(props.dataQualifier) && props.dataQualifier}
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1, overflowX: 'clip' }}>{props.children}</Box>
      </Box>

      {isMobile && (
        <>
          <Box p={2} mt={2} bgcolor="primary.light">
            {Boolean(props.chartDescription) && (
              <Typography variant="body1" paragraph={Boolean(props.dataQualifier)}>
                {props.chartDescription}
              </Typography>
            )}
            {Boolean(props.dataQualifier) && props.dataQualifier}
          </Box>
        </>
      )}
    </Box>
  );
}

export default InterpretationBlock;
