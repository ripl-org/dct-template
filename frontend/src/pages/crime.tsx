import Head from 'next/head';
import Script from 'next/script';
import { Box, Typography } from '@mui/material';
import TableauViz from '@/components/TableauViz';
import OffsetHashedSection from '@/components/OffsetHashedSection';
import Crime24HRSection from '@/components/Crime24HRSection';
import TabNavigation from '@/components/layout/TabNavigation';
import DataPageHeader from '@/components/DataPageHeader';
import FixedWidthContainer from '@/components/layout/FixedWidthContainer';
import useCrime24HR from '@/hooks/useCrime24HR';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import CrimeFAQ from '@/components/accordion/CrimeFAQ';
import SectionColoredDivider from '@/components/SectionColoredDivider';
import DownloadDataButton from '@/components/DownloadDataButton';

const VizURLs = {
  'CR-5': {
    vizId: 'CR_TimeofDay_Historical',
    dev: 'https://public.tableau.com/views/Crimes_17059390129380/Production_Day?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/Crimes_17059390129380/Production_Day?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
  'CR-6': {
    vizId: 'CR_DayofWeek_Historical',
    dev: 'https://public.tableau.com/views/Crimes_17059390129380/Production_Week?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/Crimes_17059390129380/Production_Week?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
  'CR-7': {
    vizId: 'CR_Month_Historical',
    dev: 'https://public.tableau.com/views/Crimes_17059390129380/Production_Month?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/Crimes_17059390129380/Production_Month?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
  'CR-8': {
    vizId: 'CR_RateOverTime_Historical',
    dev: 'https://public.tableau.com/views/AnnualizedCrimeRate_17059403450570/Production?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/AnnualizedCrimeRate_17059403450570/Production?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
};

const isProdEnv = process.env.NEXT_PUBLIC_ENVIRONMENT == 'prod';

function CrimePage() {
  const crimeQuery = useCrime24HR();

  return (
    <>
      <Head>
        <title>Crime | Data for Community Trust</title>
        <meta
          name="description"
          content="View crime data for Hazel Crest, IL via the Data for Community Trust project. This page shows recent and historical public safety data and insights."
        />
      </Head>

      <Script src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js" async type="module" />

      <DataPageHeader
        dataLastUpdated={crimeQuery.data?.date_last_updated ? new Date(crimeQuery.data?.date_last_updated) : new Date()}
        title="Crime"
        filename="Crimes_page.zip"
        description="Crime represents reported incidents with violations of law."
        year="2006"
      />

      <TabNavigation />

      <Box sx={{ mb: { xs: 4, md: 6 } }} />

      <OffsetHashedSection id="recent-activity">
        <Crime24HRSection crimeQuery={crimeQuery} />
      </OffsetHashedSection>

      <SectionColoredDivider />

      <OffsetHashedSection id="historical-activity">
        <InsetBoxContainer>
          <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
            Historical Activity
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            View all available Hazel Crest crime data over time. Please note data availability and completeness varies
            by year.
          </Typography>
        </InsetBoxContainer>

        <FixedWidthContainer>
          <TableauViz vizId={VizURLs['CR-5'].vizId} sx={{ mb: 9 }} src={VizURLs['CR-5'][isProdEnv ? 'prod' : 'dev']} />

          <TableauViz vizId={VizURLs['CR-6'].vizId} sx={{ mb: 9 }} src={VizURLs['CR-6'][isProdEnv ? 'prod' : 'dev']} />

          <TableauViz vizId={VizURLs['CR-7'].vizId} sx={{ mb: 9 }} src={VizURLs['CR-7'][isProdEnv ? 'prod' : 'dev']} />

          <TableauViz vizId={VizURLs['CR-8'].vizId} src={VizURLs['CR-8'][isProdEnv ? 'prod' : 'dev']} />
        </FixedWidthContainer>
      </OffsetHashedSection>

      <SectionColoredDivider />

      <OffsetHashedSection id="faqs">
        <CrimeFAQ />
      </OffsetHashedSection>

      <InsetBoxContainer>
        <Box sx={{ display: 'flex', justifyContent: 'end', my: 6, color: 'green.main' }}>
          <DownloadDataButton filename="Crimes_page.zip" dataCategory="Crime" year="2006" />
        </Box>
      </InsetBoxContainer>
    </>
  );
}

export default CrimePage;
