import Head from 'next/head';
import Script from 'next/script';
import { Box, Typography } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import TableauViz from '@/components/TableauViz';
import TrafficStops24HRSection from '@/components/TrafficStops24HRSection';
import OffsetHashedSection from '@/components/OffsetHashedSection';
import TabNavigation from '@/components/layout/TabNavigation';
import DataPageHeader from '@/components/DataPageHeader';
import FixedWidthContainer from '@/components/layout/FixedWidthContainer';
import useTrafficStops24HR from '@/hooks/useTrafficStops24HR';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import TrafficStopsFAQ from '@/components/accordion/TrafficStopsFAQ';
import SectionColoredDivider from '@/components/SectionColoredDivider';
import DownloadDataButton from '@/components/DownloadDataButton';

const VizURLs = {
  ['TS-5']: {
    vizId: 'TS_TimeofDay_Historical',
    dev: 'https://public.tableau.com/views/TrafficStops_17059399605060/Production_Time?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/TrafficStops_17059399605060/Production_Time?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
  ['TS-6']: {
    vizId: 'TS_DayofWeek_Historical',
    dev: 'https://public.tableau.com/views/TrafficStops_17059399605060/Production_Day?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/TrafficStops_17059399605060/Production_Day?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
  ['TS-7']: {
    vizId: 'TS_MonthlyTotals',
    dev: 'https://public.tableau.com/views/TrafficStops_17059399605060/Production_Month?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/TrafficStops_17059399605060/Production_Month?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
  ['TS-8']: {
    vizId: 'TS_byYear',
    dev: 'https://public.tableau.com/views/TrafficStops_17059399605060/Production_Year?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/TrafficStops_17059399605060/Production_Year?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
};

const isProdEnv = process.env.NEXT_PUBLIC_ENVIRONMENT == 'prod';

function TrafficStopsPage() {
  const trafficStopsQuery = useTrafficStops24HR();

  return (
    <>
      <Head>
        <title>Traffic Stops | Data for Community Trust</title>
        <meta
          name="description"
          content="View traffic stops data for Hazel Crest, IL via the Data for Community Trust project. This page shows recent and historical public safety data and insights."
        />
      </Head>

      <Script src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js" async type="module" />

      <DataPageHeader
        dataLastUpdated={
          trafficStopsQuery.data?.date_last_updated ? new Date(trafficStopsQuery.data?.date_last_updated) : new Date()
        }
        title="Traffic Stops"
        filename="TrafficStops_page.zip"
        description="Traffic Stops are incidents where civilians were stopped for suspected violation of traffic laws."
        year="2005"
      />

      <TabNavigation />

      <Box sx={{ mb: { xs: 4, md: 6 } }} />

      <OffsetHashedSection id="recent-activity">
        <TrafficStops24HRSection trafficStopsQuery={trafficStopsQuery} />
      </OffsetHashedSection>

      <SectionColoredDivider />

      <OffsetHashedSection id="historical-activity">
        <InsetBoxContainer>
          <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
            Historical Activity
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            View all available traffic stops data over time. Please note data availability and completeness varies by
            year.
          </Typography>
        </InsetBoxContainer>

        <FixedWidthContainer>
          <TableauViz vizId={VizURLs['TS-5'].vizId} sx={{ mb: 9 }} src={VizURLs['TS-5'][isProdEnv ? 'prod' : 'dev']} />

          <TableauViz vizId={VizURLs['TS-6'].vizId} sx={{ mb: 9 }} src={VizURLs['TS-6'][isProdEnv ? 'prod' : 'dev']} />

          <TableauViz vizId={VizURLs['TS-7'].vizId} sx={{ mb: 9 }} src={VizURLs['TS-7'][isProdEnv ? 'prod' : 'dev']} />

          <TableauViz vizId={VizURLs['TS-8'].vizId} sx={{ mb: 9 }} src={VizURLs['TS-8'][isProdEnv ? 'prod' : 'dev']} />

          {/* TODO: DATA GAP: Make this a component */}
          <Box sx={{ p: 2, backgroundColor: (theme) => theme.palette.primary.light, display: 'flex', gap: 2 }}>
            <AnnouncementIcon sx={{ mt: 0.5 }} />
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                The following traffic stop data are not available in a digital format and cannot be displayed on this
                website yet:
              </Typography>

              <Box component="ul" sx={{ m: 0 }}>
                <Typography component="li">Demographics of individuals involved in traffic stop incidents.</Typography>

                <Typography component="li">Reason for a traffic stop.</Typography>

                <Typography component="li">Outcome of a traffic stop.</Typography>
              </Box>
            </Box>
          </Box>
        </FixedWidthContainer>
      </OffsetHashedSection>

      <SectionColoredDivider />

      <OffsetHashedSection id="faqs">
        <TrafficStopsFAQ />
      </OffsetHashedSection>

      <InsetBoxContainer>
        <Box sx={{ display: 'flex', justifyContent: 'end', my: 6, color: 'green.main' }}>
          <DownloadDataButton dataCategory="Traffic Stops" filename="TrafficStops_page.zip" year="2005" />
        </Box>
      </InsetBoxContainer>
    </>
  );
}

export default TrafficStopsPage;
