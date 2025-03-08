import { Close } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const GlossaryTooltip = ({ children, definition }: { children: React.ReactNode; definition: string }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCloseTooltip = () => {
    setTooltipOpen(false);
  };

  const handleOpenTooltip = () => {
    setTooltipOpen(true);
  };

  return (
    <Tooltip
      open={tooltipOpen}
      onClose={handleCloseTooltip}
      onOpen={handleOpenTooltip}
      disableTouchListener
      arrow
      placement={'top'}
      title={
        <Box sx={{ display: 'flex', alignItems: 'start' }}>
          <Box sx={{ py: 1, px: 1.5 }}>{definition}</Box>

          <IconButton onClick={handleCloseTooltip} color="inherit" edge="end" sx={{ mr: 0 }}>
            <Close />
          </IconButton>
        </Box>
      }
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
      <Typography
        component="span"
        variant="inherit"
        tabIndex={0}
        onClick={handleOpenTooltip}
        sx={{
          textDecoration: 'underline',
          textDecorationColor: (theme) => theme.palette.green.main,
          textUnderlineOffset: 3,
          textDecorationStyle: 'dotted',
          textDecorationThickness: 2,
          cursor: 'pointer',

          '&:hover': {
            textDecorationColor: (theme) => theme.palette.green.dark, // Change color on hover
          },
        }}
      >
        {children}
      </Typography>
    </Tooltip>
  );
};

export default GlossaryTooltip;
