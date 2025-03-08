import Head from 'next/head';
import Script from 'next/script';
import { Box, Typography } from '@mui/material';
import TableauViz from '@/components/TableauViz';
import OffsetHashedSection from '@/components/OffsetHashedSection';
import TabNavigation from '@/components/layout/TabNavigation';
import DataPageHeader from '@/components/DataPageHeader';
import FixedWidthContainer from '@/components/layout/FixedWidthContainer';
import useCrime24HR from '@/hooks/useCrime24HR';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import SectionColoredDivider from '@/components/SectionColoredDivider';
import DownloadDataButton from '@/components/DownloadDataButton';
import CrimeDemographicsFAQ from '@/components/accordion/CrimeDemographicsFAQ';

const VizURLs = {
  'crd-1': {
    vizId: 'CRD_VictimDemo',
    dev: 'https://public.tableau.com/views/CrimeVictim_17059391178000/Production_Race?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/CrimeVictim_17059391178000/Production_Race?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
  'crd-2': {
    vizId: 'CRD_OffenderDemo',
    dev: 'https://public.tableau.com/views/CrimeOffender_17059391850310/Production_Race?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/CrimeOffender_17059391850310/Production_Race?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
  'crd-3': {
    vizId: 'CRD_ArrestsDemo',
    dev: 'https://public.tableau.com/views/CrimeArrest_17304854314950/Production_Race?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/CrimeArrest_17304854314950/Production_Race?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
};

export const TABS = [
  { label: 'Historical Activity', path: 'historical-activity' },
  { label: 'FAQs', path: 'faqs' },
];

const isProdEnv = process.env.NEXT_PUBLIC_ENVIRONMENT == 'prod';

function CrimeDemographicsPage() {
  const crimeQuery = useCrime24HR();

  return (
    <>
      <Head>
        <title>Crime Demographics | Data for Community Trust</title>
        <meta
          name="description"
          content="View crime demographics data for Hazel Crest, IL via the Data for Community Trust project. This page shows recent and historical public safety data and insights."
        />
      </Head>

      <Script src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js" async type="module" />

      <DataPageHeader
        dataLastUpdated={crimeQuery.data?.date_last_updated ? new Date(crimeQuery.data?.date_last_updated) : new Date()}
        title="Crime Demographics"
        filename="CrimeDemographics_page.zip"
        description="Information on race, sex, and age of civilians involved in a crime incident."
        year="2015"
      />

      <TabNavigation tabs={TABS} />

      <Box sx={{ mb: { xs: 4, md: 6 } }} />

      <OffsetHashedSection id="historical-activity">
        <InsetBoxContainer>
          <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
            Historical Activity
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            View all available demographic data relating to crime over time. Please note availability and completeness
            varies by month and year.
          </Typography>
        </InsetBoxContainer>

        <FixedWidthContainer>
          <TableauViz
            vizId={VizURLs['crd-1'].vizId}
            sx={{ mb: 9 }}
            src={VizURLs['crd-1'][isProdEnv ? 'prod' : 'dev']}
          />

          <TableauViz
            vizId={VizURLs['crd-2'].vizId}
            sx={{ mb: 9 }}
            src={VizURLs['crd-2'][isProdEnv ? 'prod' : 'dev']}
          />

          <TableauViz vizId={VizURLs['crd-3'].vizId} src={VizURLs['crd-3'][isProdEnv ? 'prod' : 'dev']} />
        </FixedWidthContainer>
      </OffsetHashedSection>

      <SectionColoredDivider />

      <OffsetHashedSection id="faqs">
        <CrimeDemographicsFAQ />
      </OffsetHashedSection>

      <InsetBoxContainer>
        <Box sx={{ display: 'flex', justifyContent: 'end', my: 6, color: 'green.main' }}>
          <DownloadDataButton filename="CrimeDemographics_page.zip" dataCategory="Crime" year="2006" />
        </Box>
      </InsetBoxContainer>
    </>
  );
}

export default CrimeDemographicsPage;
