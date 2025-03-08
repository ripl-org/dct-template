import Head from 'next/head';
import Script from 'next/script';
import { Box, Typography } from '@mui/material';
import OffsetHashedSection from '@/components/OffsetHashedSection';
import TabNavigation from '@/components/layout/TabNavigation';
import DataPageHeader from '@/components/DataPageHeader';
import SectionColoredDivider from '@/components/SectionColoredDivider';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import DownloadDataButton from '@/components/DownloadDataButton';
import TableauViz from '@/components/TableauViz';
import FixedWidthContainer from '@/components/layout/FixedWidthContainer';
import UseOfForceDemographicsFAQ from '@/components/accordion/UseOfForceDemographicsFAQ';
import { USE_OF_FORCE_DATA_LAST_UPDATED_DATE } from '@/constants/useOfForce';

const VizURLs = {
  ['UF-5']: {
    vizId: 'UF_CivilianInvolved',
    dev: 'https://public.tableau.com/views/UseofForce_17061083109850/Production_Race?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/UseofForce_17061083109850/Production_Race?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link',
  },
};

export const TABS = [
  { label: 'Historical Activity', path: 'historical-activity' },
  { label: 'FAQs', path: 'faqs' },
];

const isProdEnv = process.env.NEXT_PUBLIC_ENVIRONMENT == 'prod';

function UseOfForceDemographicsPage() {
  return (
    <>
      <Head>
        <title>Use of Force Demographics | Data for Community Trust</title>
        <meta
          name="description"
          content="View use of force demographics data for Hazel Crest, IL via the Data for Community Trust project. This page shows recent and historical public safety data and insights."
        />
      </Head>

      <Script src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js" async type="module" />

      <DataPageHeader
        dataLastUpdated={new Date(USE_OF_FORCE_DATA_LAST_UPDATED_DATE)}
        title="Use of Force Demographics"
        filename="UseOfForce_page.zip"
        description="Information on race, sex, and age of civilians involved for a reported use of force by police officers."
        year="2020"
      />

      <TabNavigation tabs={TABS} />

      <Box sx={{ mb: { xs: 4, md: 6 } }} />

      <OffsetHashedSection id="historical-activity">
        <InsetBoxContainer>
          <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
            Historical Activity
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            View all available use of force demographic data over time. Please note data availability and completeness
            varies by year.
          </Typography>
        </InsetBoxContainer>

        <FixedWidthContainer>
          <TableauViz vizId={VizURLs['UF-5'].vizId} sx={{ mb: 9 }} src={VizURLs['UF-5'][isProdEnv ? 'prod' : 'dev']} />
        </FixedWidthContainer>
      </OffsetHashedSection>

      <SectionColoredDivider />

      <OffsetHashedSection id="faqs">
        <UseOfForceDemographicsFAQ />
      </OffsetHashedSection>

      <InsetBoxContainer>
        <Box sx={{ display: 'flex', justifyContent: 'end', my: 6, color: 'green.main' }}>
          <DownloadDataButton dataCategory="Use of Force" filename="UseOfForce_page.zip" year="2020" />
        </Box>
      </InsetBoxContainer>
    </>
  );
}

export default UseOfForceDemographicsPage;
