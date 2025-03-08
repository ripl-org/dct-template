import { AppBar, Container, Tab, Tabs, type Theme, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { NextLinkComposed } from '@/components/Link';
import { sendEvent } from '@/lib/gtag';

export const DEFAULT_TABS = [
  { label: 'Recent Activity', path: 'recent-activity' },
  { label: 'Historical Activity', path: 'historical-activity' },
  { label: 'FAQs', path: 'faqs' },
];

const TabNavigation = ({ tabs = DEFAULT_TABS }: { tabs?: { label: string; path: string }[] }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isTabNavigationFixed, setIsTabNavigationFixed] = useState(false);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const tabNavigationRef = useRef<HTMLDivElement>(null);

  const scrollPositionOffset = isMobile ? 100 : 600;

  useEffect(() => {
    const handleScroll = () => {
      // Get the positions of each section or element that corresponds to a tab
      const sectionPositions = tabs.map((tab) => document.getElementById(tab.path)?.offsetTop ?? 0);

      // Determine which section is currently in view based on scroll position
      const scrollPosition = window.scrollY + scrollPositionOffset; // Adjust this offset as needed
      let newActiveTab = 0;
      for (let i = 0; i < sectionPositions.length; i++) {
        if (scrollPosition >= sectionPositions[i]) {
          newActiveTab = i;
        } else {
          break;
        }
      }

      // Update active tab if it has changed
      if (activeTab !== newActiveTab) {
        setActiveTab(newActiveTab);
      }
    };

    // Blur tab elements to prevent focus state styles persisting
    tabs.forEach((tab) => document.getElementById(`tab-${tab.path}`)?.blur());

    // Add scroll event listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Remove scroll event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab, tabs, scrollPositionOffset]); // Add dependencies as needed

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Update the state based on whether the tab navigation element is intersecting with its root
        setIsTabNavigationFixed(!entry.isIntersecting);
      },
      {
        // Set a rootMargin with the offset you desire
        rootMargin: '-144px 0px 0px 0px', // adjust the top margin (negative value means upward offset)
      },
    );
    const currentRef = tabNavigationRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <>
      <div ref={tabNavigationRef} />

      <AppBar
        sx={{
          backgroundColor: 'white',
          border: 'none',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          marginTop: isMobile && isTabNavigationFixed ? '56px' : 0,
          px: { xs: 0, md: 12 },
          height: '72px',
        }}
        position={isMobile && isTabNavigationFixed ? 'fixed' : 'sticky'}
        variant="outlined"
        elevation={0}
      >
        <Container
          maxWidth={false}
          sx={{
            height: '100%',
            '&& div': {
              height: '100%',
            },
          }}
        >
          <Tabs
            value={activeTab}
            variant={isMobile ? 'fullWidth' : 'standard'}
            aria-label="Same page tabs navigation"
            role="navigation"
            TabIndicatorProps={{
              sx: { backgroundColor: 'black', height: 8 },
            }}
            sx={{
              '&& div': {
                height: '100%',
                gap: 4,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                sx={{
                  textTransform: 'none',
                  fontSize: '16px',
                  px: 0,
                  py: 0,
                  height: '100%',
                  color: 'green.main',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'transparent',
                  },
                  '&:active::after, &:focus::after': {
                    backgroundColor: (theme) => theme.palette.green.dark,
                  },
                  minWidth: 0,
                  '&:focus': {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                  '@media (hover: hover)': {
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.primary.light,
                    },
                    '&:hover::after': {
                      backgroundColor: (theme) => theme.palette.green.dark,
                    },
                  },
                  '&:hover': {},
                  '&.Mui-selected': {
                    color: 'black',
                    fontWeight: 'bold',
                  },
                }}
                disableFocusRipple
                key={index}
                label={tab.label}
                component={NextLinkComposed}
                to={`#${tab.path}`}
                id={`tab-${tab.path}`}
                onClick={() =>
                  sendEvent('tab_navigation', {
                    target: tab.label,
                  })
                }
              />
            ))}
          </Tabs>
        </Container>
      </AppBar>
    </>
  );
};

export default TabNavigation;
