import DataLastUpdatedText from '@/components/DataLastUpdatedText';
import DownloadDataButton from '@/components/DownloadDataButton';
import { Box, Chip, Container, Typography } from '@mui/material';

function DataPageHeader(props: {
  dataLastUpdated?: Date;
  title: string;
  description: string | React.ReactElement;
  filename?: string;
  year: string;
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        background: 'url("/assets/images/HazelCrestHeader@1x.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'green.main',
        color: 'white',
        px: { xs: 0, md: 12 },
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
        }}
      />
      <Container
        maxWidth={false}
        sx={{
          pt: 1,
          pb: 5,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {props.filename ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <DownloadDataButton filename={props.filename} dataCategory={props.title} year={props.year} />
          </Box>
        ) : (
          <Box mb={5.5} />
        )}
        <Chip label="Village of Hazel Crest, IL" color="secondary" sx={{ mb: 1, fontWeight: 'bold' }} />
        <Typography color="inherit" component="h1" variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
          {props.title}
        </Typography>
        <Typography sx={{ mb: 1 }} variant="body1">
          {props.description}
        </Typography>

        {props.dataLastUpdated && (
          <DataLastUpdatedText
            dataLastUpdated={props.dataLastUpdated}
            isUseOfForcePage={props.filename === 'UseOfForce_page.zip'}
          />
        )}
      </Container>
    </Box>
  );
}

export default DataPageHeader;
