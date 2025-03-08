import { Box, Container, Fab, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

import HazelCrestLogo2 from '../../../public/assets/images/hazel-crest-logo-2.png';
import Link from '@/components/Link';
import InsetBoxContainer from '@/components/InsetBoxContainer';

const navigationData = [
  {
    label: 'Overview',
    path: '/',
  },
  {
    label: 'Calls for Service',
    path: '/calls-for-service',
  },
  {
    label: 'Crime',
    path: '/crime',
  },
  {
    label: 'Crime Demographics',
    path: '/crime-demographics',
  },
  {
    label: 'Traffic Stops',
    path: '/traffic-stops',
  },
  {
    label: 'Use of Force',
    path: '/use-of-force',
  },
  {
    label: 'Use of Force Demographics',
    path: '/use-of-force-demographics',
  },
];

function Footer() {
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return (
    <Box component="footer">
      <Box bgcolor="primary.light" py={5}>
        <InsetBoxContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <a href="https://villageofhazelcrest.org/" target="_blank">
              <Image alt="Hazel Crest logo" src={HazelCrestLogo2} width={100} height={100} />
            </a>

            <Box>
              <Fab onClick={scrollToTop} color="secondary" aria-label="scroll-to-the-top" size="small">
                <KeyboardArrowUpIcon />
              </Fab>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'block', lg: 'flex' } }}>
            {/* Left content */}
            <Box
              sx={{
                display: 'flex',
                gap: 6,
                flex: '50%',
                justifyContent: { xs: 'space-between', lg: 'initial' },
                mb: { xs: 2, lg: 0 },
              }}
            >
              <Box sx={{ maxWidth: '170px' }}>
                {navigationData.map((item) => (
                  <Link key={item.path} variant="body2" href={item.path} sx={{ display: 'block', mb: 1.5 }}>
                    {item.label}
                  </Link>
                ))}
              </Box>

              <Box sx={{ maxWidth: '170px' }}>
                <Link variant="body2" href={'/methodology'} sx={{ display: 'block', mb: 1.5 }}>
                  Methodology
                </Link>

                <Link
                  variant="body2"
                  href={'https://villageofhazelcrest.org/'}
                  target="_blank"
                  sx={{ display: 'block', mb: 1.5 }}
                >
                  Visit Hazel Crest Community Website
                </Link>
              </Box>
            </Box>

            {/* Right content */}
            <Box sx={{ flex: '20%' }}>
              <Typography variant="body2">
                Data for Community Trust provides communities information on crime and public safety activity. The goal
                is to inform transparent, actionable conversations between community members and the public safety
                agencies that serve them.
              </Typography>
            </Box>
          </Box>
        </InsetBoxContainer>
      </Box>

      <Box bgcolor="green.main" py={2} sx={{ px: { xs: 0, md: 12 } }}>
        <Container maxWidth={false}>
          <Stack direction="row" useFlexGap flexWrap="wrap" sx={{ gap: { xs: 2.5, md: 3 } }}>
            <Link variant="body2" href="terms-of-use" color="common.white">
              Terms of Use
            </Link>
            <Link variant="body2" href="privacy-policy" color="common.white">
              Privacy Policy
            </Link>
            <Link variant="body2" href="mailto:info@hazelcrest.dataforcommunitytrust.org" color="common.white">
              Contact Us
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default Footer;
