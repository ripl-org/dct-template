import { USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE } from '@/constants/useOfForce';
import { Close, Info } from '@mui/icons-material';
import { Box, IconButton, type Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

function DataLastUpdatedText(props: { dataLastUpdated: Date; isUseOfForcePage?: boolean }) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCloseTooltip = () => {
    setTooltipOpen(false);
  };

  const handleOpenTooltip = () => {
    setTooltipOpen(true);
  };
  return (
    <Typography variant="body2" suppressHydrationWarning>
      {`Data last updated: ${props.isUseOfForcePage ? USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE : dayjs(props.dataLastUpdated).format('h:mm A CT dddd, MMMM D, YYYY')}`}{' '}
      <Box component="span" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <Tooltip
          open={tooltipOpen}
          onClose={handleCloseTooltip}
          onOpen={handleOpenTooltip}
          disableTouchListener
          title={
            <Box sx={{ display: 'flex', alignItems: 'start' }}>
              <Box sx={{ py: 1, px: 1.5 }}>
                This is the date of the last data update from the Hazel Crest Police Department.{' '}
                {!props.isUseOfForcePage && 'Typically, this date will be within the last 24 hours.'}
              </Box>

              <IconButton onClick={handleCloseTooltip} color="inherit" edge="end" sx={{ mr: 0 }}>
                <Close />
              </IconButton>
            </Box>
          }
          arrow
          placement={isMobile ? 'top-start' : 'right'}
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: (theme) => theme.palette.primary.dark,
                fontSize: '14px',
                p: 0,
              },
            },
            arrow: { sx: { color: (theme) => theme.palette.primary.dark } },
          }}
        >
          <Info
            tabIndex={0}
            onClick={handleOpenTooltip}
            focusable
            sx={{
              '&:hover': {
                fill: (theme) => theme.palette.green.light,
              },
            }}
          />
        </Tooltip>
      </Box>
    </Typography>
  );
}

export default DataLastUpdatedText;
