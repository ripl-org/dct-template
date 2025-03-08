import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import Script from 'next/script';

import TableauViz from '@/components/TableauViz';
import CallsForService24HRSection from '@/components/CallsForService24HRSection';
import TabNavigation from '@/components/layout/TabNavigation';
import OffsetHashedSection from '@/components/OffsetHashedSection';
import DataPageHeader from '@/components/DataPageHeader';
import FixedWidthContainer from '@/components/layout/FixedWidthContainer';
import useCallsForService24HR from '@/hooks/useCallsForService24HR';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import SectionColoredDivider from '@/components/SectionColoredDivider';
import DownloadDataButton from '@/components/DownloadDataButton';
import CallsForServiceFAQ from '@/components/accordion/CallsForServiceFAQ';

const VizURLs = {
  'CFS-5': {
    vizId: 'CFS_TimeofDay_Historical',
    dev: 'https://public.tableau.com/views/CallsForService_17059395487030/Production_Day?:language=en-US&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/CallsForService_17059395487030/Production_Day?:language=en-US&:display_count=n&:origin=viz_share_link',
  },
  'CFS-6': {
    vizId: 'CFS_DayofWeek_Historical',
    dev: 'https://public.tableau.com/views/CallsForService_17059395487030/Production_Week?:language=en-US&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/CallsForService_17059395487030/Production_Week?:language=en-US&:display_count=n&:origin=viz_share_link',
  },
  'CFS-7': {
    vizId: 'CFS_Month_Historical',
    dev: 'https://public.tableau.com/views/CallsForService_17059395487030/Production_Month?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/CallsForService_17059395487030/Production_Month?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link',
  },
  'CFS-8': {
    vizId: 'CFS_AvgTimeScene_CallType',
    dev: 'https://public.tableau.com/views/OfficerRadioLogs_17059389218890/Production_Scene_Type?:language=en-US&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/OfficerRadioLogs_17059389218890/Production_Scene_Type?:language=en-US&:display_count=n&:origin=viz_share_link',
  },
  'CFS-9': {
    vizId: 'CFS_AvgTimeScene_Priority',
    dev: 'https://public.tableau.com/views/OfficerRadioLogs_17059389218890/Production_Scene_Priority?:language=en-US&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/OfficerRadioLogs_17059389218890/Production_Scene_Priority?:language=en-US&:display_count=n&:origin=viz_share_link',
  },
  'CFS-10': {
    vizId: 'CFS_AvgResponse_Priority',
    dev: 'https://public.tableau.com/views/OfficerResponseTime/Production?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/OfficerResponseTime/Production?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link',
  },
};

const isProdEnv = process.env.NEXT_PUBLIC_ENVIRONMENT == 'prod';

function CallsForServicePage() {
  const callsForServiceQuery = useCallsForService24HR();

  return (
    <>
      <Head>
        <title>Calls for Service | Data for Community Trust</title>
        <meta
          name="description"
          content="View calls for service data for Hazel Crest, IL via the Data for Community Trust project. This page shows recent and historical public safety data and insights."
        />
      </Head>

      <Script src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js" async type="module" />

      <DataPageHeader
        dataLastUpdated={
          callsForServiceQuery.data?.date_last_updated
            ? new Date(callsForServiceQuery.data?.date_last_updated)
            : new Date()
        }
        filename="CallsForService_page.zip"
        title="Calls for Service"
        year="2005"
        description="Calls for Service are 911 calls and calls to non-emergency numbers that required a police response."
      />

      <TabNavigation />

      <Box sx={{ mb: { xs: 4, md: 6 } }} />

      <OffsetHashedSection id="recent-activity">
        <CallsForService24HRSection callsForServiceQuery={callsForServiceQuery} />
      </OffsetHashedSection>

      <SectionColoredDivider />

      <OffsetHashedSection id="historical-activity">
        <InsetBoxContainer>
          <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
            Historical Activity
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            View all available Hazel Crest calls for service data over time. Please note data availability and
            completeness varies by year.
          </Typography>
        </InsetBoxContainer>

        <FixedWidthContainer>
          <TableauViz
            vizId={VizURLs['CFS-5'].vizId}
            sx={{ mb: 9 }}
            src={VizURLs['CFS-5'][isProdEnv ? 'prod' : 'dev']}
          />

          <TableauViz
            vizId={VizURLs['CFS-6'].vizId}
            sx={{ mb: 9 }}
            src={VizURLs['CFS-6'][isProdEnv ? 'prod' : 'dev']}
          />

          <TableauViz
            vizId={VizURLs['CFS-7'].vizId}
            sx={{ mb: 9 }}
            src={VizURLs['CFS-7'][isProdEnv ? 'prod' : 'dev']}
          />

          <TableauViz
            vizId={VizURLs['CFS-8'].vizId}
            sx={{ mb: 9 }}
            src={VizURLs['CFS-8'][isProdEnv ? 'prod' : 'dev']}
          />

          <TableauViz
            vizId={VizURLs['CFS-9'].vizId}
            sx={{ mb: 9 }}
            src={VizURLs['CFS-9'][isProdEnv ? 'prod' : 'dev']}
          />

          <TableauViz vizId={VizURLs['CFS-10'].vizId} src={VizURLs['CFS-10'][isProdEnv ? 'prod' : 'dev']} />
        </FixedWidthContainer>
      </OffsetHashedSection>

      <SectionColoredDivider />

      <OffsetHashedSection id="faqs">
        <CallsForServiceFAQ />
      </OffsetHashedSection>

      <InsetBoxContainer>
        <Box sx={{ display: 'flex', justifyContent: 'end', my: 6, color: 'green.main' }}>
          <DownloadDataButton filename="CallsForService_page.zip" dataCategory="Calls for Service" year="2005" />
        </Box>
      </InsetBoxContainer>
    </>
  );
}

export default CallsForServicePage;
