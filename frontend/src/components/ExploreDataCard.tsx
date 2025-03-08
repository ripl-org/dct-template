import { NextLinkComposed } from '@/components/Link';
import { sendEvent } from '@/lib/gtag';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';

function ExploreDataCard(props: { title: string; description: string; link: string; imagePath: string }) {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        p: { xs: 2, md: 3 },
        height: '100%',
        display: 'flex',
        gap: { xs: 2, md: 3 },
        borderRadius: '4px',
      }}
    >
      <Box sx={{ flex: { md: '0 0 146px' }, width: '146px', minHeight: '206px', height: '100%', position: 'relative' }}>
        <Image
          src={props.imagePath}
          alt={`${props.title} visualization example`}
          style={{
            borderRadius: 4,
            objectFit: 'cover',
            height: '100%',
          }}
          fill
        />
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: (theme) => theme.palette.green.main,
            opacity: 0.35,
            borderRadius: '4px',
          }}
        ></Box>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            component="h3"
            variant="h6"
            color="primary.dark"
            fontWeight="bold"
            sx={{ lineHeight: 1.2 }}
            mb={0.5}
          >
            {props.title}
          </Typography>

          <Typography component="h3" variant="body1" paragraph>
            {props.description}
          </Typography>
        </Box>

        <Box>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            component={NextLinkComposed}
            to={props.link}
            onClick={() => {
              sendEvent('see_the_data', {
                target: props.link,
              });
            }}
          >
            SEE THE DATA
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ExploreDataCard;
