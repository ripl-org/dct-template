import { Box, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';

import { type IconsByCategory } from '@/types';

function Legend(props: { legendTitle?: string; iconsByCategory: IconsByCategory }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        bottom: 8,
        right: 8,
        zIndex: 1000,
        maxWidth: 180,
      }}
    >
      <List
        dense
        sx={{ py: 1 }}
        subheader={
          <ListSubheader color="inherit" sx={{ backgroundColor: 'transparent', lineHeight: '18px', px: 1, mb: 0.5 }}>
            {props.legendTitle}
          </ListSubheader>
        }
      >
        {Object.keys(props.iconsByCategory).map((category) => (
          <ListItem key={category} sx={{ px: 1, py: 0 }}>
            <ListItemIcon sx={{ minWidth: { xs: 30, md: 36 }, fontSize: { xs: 20, md: 24 } }}>
              {props.iconsByCategory[category]}
            </ListItemIcon>
            <ListItemText
              primary={category}
              primaryTypographyProps={{ sx: { fontSize: { xs: '12px', md: '14px' } } }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Legend;
