import { NextLinkComposed } from '@/components/Link';
import { sendEvent } from '@/lib/gtag';
import {
  Close as CloseIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  OpenInNew as OpenInNewIcon,
  HomeOutlined as HomeIconOutlined,
  AssessmentOutlined as AssessmentIconOutlined,
} from '@mui/icons-material';

import {
  AppBar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

const drawerWidth = 235;

const MethodologyIcon = () => (
  <SvgIcon>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.4002 21L15.0002 19.6L16.5802 18L15.0002 16.42L16.4002 14.99L18.0002 16.59L19.5802 14.99L21.0102 16.42L19.4102 18L21.0102 19.6L19.5802 21L18.0002 19.42L16.4002 21ZM6.00023 21C5.17023 21 4.46023 20.71 3.87023 20.12C3.28023 19.53 2.99023 18.83 2.99023 17.99C2.99023 17.15 3.28023 16.45 3.87023 15.86C4.46023 15.27 5.16023 14.98 6.00023 14.98C6.62023 14.98 7.18023 15.15 7.69023 15.49C8.20023 15.83 8.57023 16.29 8.80023 16.88C9.45023 16.7 9.98023 16.34 10.3902 15.8C10.8002 15.26 11.0002 14.66 11.0002 13.97V9.96996C11.0002 8.58996 11.4902 7.40996 12.4602 6.42996C13.4302 5.44996 14.6102 4.96996 16.0002 4.96996H17.1502L15.5702 3.38996L17.0002 1.95996L21.0002 5.95996L17.0002 9.95996L15.5702 8.55996L17.1502 6.95996H16.0002C15.1702 6.95996 14.4602 7.24996 13.8702 7.83996C13.2802 8.42996 12.9902 9.12996 12.9902 9.96996V13.97C12.9902 15.19 12.6002 16.26 11.8102 17.18C11.0202 18.1 10.0302 18.68 8.83023 18.89C8.63023 19.51 8.27023 20.01 7.74023 20.39C7.21023 20.77 6.63023 20.97 5.98023 20.97L6.00023 21ZM4.40023 8.99996L3.00023 7.59996L4.58023 5.99996L3.00023 4.41996L4.40023 2.98996L6.00023 4.58996L7.58023 2.98996L9.01023 4.41996L7.41023 5.99996L9.01023 7.59996L7.58023 8.99996L6.00023 7.41996L4.40023 8.99996Z"
        fill="black"
      />
    </svg>
  </SvgIcon>
);

const MethodologyIconOutlined = () => (
  <SvgIcon>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.4002 21L15.0002 19.6L16.5802 18L15.0002 16.42L16.4002 14.99L18.0002 16.59L19.5802 14.99L21.0102 16.42L19.4102 18L21.0102 19.6L19.5802 21L18.0002 19.42L16.4002 21ZM6.00023 19C6.28023 19 6.52023 18.9 6.71023 18.71C6.90023 18.52 7.00023 18.28 7.00023 18C7.00023 17.72 6.90023 17.48 6.71023 17.29C6.52023 17.1 6.28023 17 6.00023 17C5.72023 17 5.48023 17.1 5.29023 17.29C5.10023 17.48 5.00023 17.72 5.00023 18C5.00023 18.28 5.10023 18.52 5.29023 18.71C5.48023 18.9 5.72023 19 6.00023 19ZM6.00023 21C5.17023 21 4.46023 20.71 3.87023 20.12C3.28023 19.53 2.99023 18.83 2.99023 17.99C2.99023 17.15 3.28023 16.45 3.87023 15.86C4.46023 15.27 5.16023 14.98 6.00023 14.98C6.62023 14.98 7.18023 15.15 7.69023 15.49C8.20023 15.83 8.57023 16.29 8.80023 16.88C9.45023 16.7 9.98023 16.34 10.3902 15.8C10.8002 15.26 11.0002 14.66 11.0002 13.97V9.96996C11.0002 8.58996 11.4902 7.40996 12.4602 6.42996C13.4302 5.44996 14.6102 4.96996 16.0002 4.96996H17.1502L15.5702 3.38996L17.0002 1.95996L21.0002 5.95996L17.0002 9.95996L15.5702 8.55996L17.1502 6.95996H16.0002C15.1702 6.95996 14.4602 7.24996 13.8702 7.83996C13.2802 8.42996 12.9902 9.12996 12.9902 9.96996V13.97C12.9902 15.19 12.6002 16.26 11.8102 17.18C11.0202 18.1 10.0302 18.68 8.83023 18.89C8.63023 19.51 8.27023 20.01 7.74023 20.39C7.21023 20.77 6.63023 20.97 5.98023 20.97L6.00023 21ZM4.40023 8.99996L3.00023 7.59996L4.58023 5.99996L3.00023 4.41996L4.40023 2.98996L6.00023 4.58996L7.58023 2.98996L9.01023 4.41996L7.41023 5.99996L9.01023 7.59996L7.58023 8.99996L6.00023 7.41996L4.40023 8.99996Z"
        fill="white"
      />
    </svg>
  </SvgIcon>
);

const navigationData = [
  {
    label: 'Overview',
    path: '/',
    icon: <HomeIcon />,
    outlinedIcon: <HomeIconOutlined />,
  },
  {
    label: 'Calls for Service',
    path: '/calls-for-service',
    icon: <AssessmentIcon />,
    outlinedIcon: <AssessmentIconOutlined />,
  },
  {
    label: 'Crime',
    path: '/crime',
    icon: <AssessmentIcon />,
    outlinedIcon: <AssessmentIconOutlined />,
  },
  {
    label: 'Crime Demographics  ',
    path: '/crime-demographics',
    icon: <AssessmentIcon />,
    outlinedIcon: <AssessmentIconOutlined />,
    isNested: true,
  },
  {
    label: 'Traffic Stops',
    path: '/traffic-stops',
    icon: <AssessmentIcon />,
    outlinedIcon: <AssessmentIconOutlined />,
  },
  {
    label: 'Use of Force',
    path: '/use-of-force',
    icon: <AssessmentIcon />,
    outlinedIcon: <AssessmentIconOutlined />,
  },
  {
    label: 'Use of Force Demographics',
    path: '/use-of-force-demographics',
    icon: <AssessmentIcon />,
    outlinedIcon: <AssessmentIconOutlined />,
    isNested: true,
  },
  {
    label: 'Methodology',
    path: '/methodology',
    icon: <MethodologyIcon />,
    outlinedIcon: <MethodologyIconOutlined />,
  },
];

function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
      <Toolbar sx={{ display: { xs: 'none', sm: 'block' }, paddingX: 4, paddingY: 3 }}>
        <Box maxWidth={160}>
          <Typography component="p" variant="h6" sx={{ fontSize: '16px' }} mb={0.5}>
            Data for Community Trust
          </Typography>

          <Typography component="p" variant="h6" sx={{ fontSize: '20px' }}>
            Village of
          </Typography>

          <Typography component="p" mb={2} variant="h6" sx={{ fontSize: '20px' }}>
            Hazel Crest, IL
          </Typography>

          <Chip
            label="BETA"
            variant="outlined"
            color="default"
            size="small"
            sx={{
              color: 'inherit',
              fontWeight: 'bold',
              borderColor: 'inherit',
            }}
          />
        </Box>
      </Toolbar>
      <List>
        {navigationData.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={NextLinkComposed}
              to={item.path}
              selected={router.pathname === item.path}
              onClick={handleDrawerToggle}
              dense={item.isNested}
              sx={{
                px: 3,
                textUnderlineOffset: 2,
                '&:hover': {
                  textDecoration: 'underline',
                },
                '&:focus': {
                  backgroundColor: (theme) => theme.palette.primary.main,
                  textDecoration: 'underline',
                  textUnderlineOffset: 2,
                },
                '&.Mui-selected': {
                  backgroundColor: (theme) => theme.palette.secondary.main,
                  textDecoration: 'underline',
                  color: 'black',
                  '& .MuiTypography-root': {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    textDecorationThickness: 2,
                  },
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.secondary.main,
                  },
                  '&:focus': {
                    backgroundColor: (theme) => theme.palette.secondary.main,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  ml: item.isNested ? 2 : 0,
                  color: 'inherit',
                  minWidth: '36px',
                  visibility: item.isNested ? 'hidden' : 'initial',
                }}
              >
                {router.pathname === item.path ? item.icon : item.outlinedIcon}
              </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: '#666666' }} />
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton
            href={'https://villageofhazelcrest.org/'}
            target="_blank"
            onClick={() => sendEvent('hazel_crest_website_link_click')}
            sx={{
              px: 3,
              textUnderlineOffset: 2,
              '&:hover': {
                textDecoration: 'underline',
              },
              '&:focus': {
                backgroundColor: (theme) => theme.palette.primary.main,
                textDecoration: 'underline',
                textUnderlineOffset: 2,
              },
              '&.Mui-selected': {
                backgroundColor: (theme) => theme.palette.secondary.main,
                textDecoration: 'underline',
                color: 'black',
                '& .MuiTypography-root': {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationThickness: 2,
                },
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.secondary.main,
                },
                '&:focus': {
                  backgroundColor: (theme) => theme.palette.secondary.main,
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'inherit',
                minWidth: '36px',
              }}
            >
              <OpenInNewIcon />
            </ListItemIcon>
            <ListItemText primary={'Village of Hazel Crest website'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1500,
          display: { xs: 'block', sm: 'none', backgroundColor: 'white' },
          // Prevents Tableue embeds from adding extra padding
          paddingRight: '0 !important',
          border: 'none',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
        variant="outlined"
        elevation={0}
      >
        <Toolbar>
          <Box flexGrow={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.primary">
                Data for Community Trust
              </Typography>
              <Typography variant="body1" color="text.primary">
                Village of Hazel Crest, IL
              </Typography>
            </Box>
            <Chip
              label="BETA"
              variant="outlined"
              color="default"
              size="small"
              sx={{ color: '#32383E', fontWeight: 'bold', ml: 1 }}
            />
          </Box>

          <IconButton
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ ml: 2, display: { sm: 'none' }, color: 'green.main' }}
          >
            {mobileOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          disableScrollLock
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          anchor="right"
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'primary.dark',
              color: 'white',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'primary.dark',
              color: 'white',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}

export default Header;
