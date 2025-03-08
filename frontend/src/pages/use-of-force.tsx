import Head from 'next/head';
import Script from 'next/script';
import { Box, Typography } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import UseOfForceHistoricalActivitySection from '@/components/UseOfForceHistoricalActivitySection';
import OffsetHashedSection from '@/components/OffsetHashedSection';
import TabNavigation from '@/components/layout/TabNavigation';
import DataPageHeader from '@/components/DataPageHeader';
import useUseOfForce from '@/hooks/useUseOfForce';
import UseOfForceFAQ from '@/components/accordion/UseOfForceFAQ';
import SectionColoredDivider from '@/components/SectionColoredDivider';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import DownloadDataButton from '@/components/DownloadDataButton';
import TableauViz from '@/components/TableauViz';
import FixedWidthContainer from '@/components/layout/FixedWidthContainer';
import {
  USE_OF_FORCE_DATA_LAST_UPDATED_DATE,
  USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE,
} from '@/constants/useOfForce';

const VizURLs = {
  ['UF-3']: {
    vizId: 'UF_TimeofDay_Historical',
    dev: 'https://public.tableau.com/views/UseofForceByTimeofDay/Production?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/UseofForceByTimeofDay/Production?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
  ['UF-4']: {
    vizId: 'UF_Weapon_IncidentType',
    dev: 'https://public.tableau.com/views/UseofForceWeaponType/Production?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
    prod: 'https://public.tableau.com/views/UseofForceWeaponType/Production?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link',
  },
};

export const TABS = [
  { label: 'Historical Activity', path: 'historical-activity' },
  { label: 'FAQs', path: 'faqs' },
];

const isProdEnv = process.env.NEXT_PUBLIC_ENVIRONMENT == 'prod';

function UseOfForcePage() {
  const useOfForceQuery = useUseOfForce();

  return (
    <>
      <Head>
        <title>Use of Force | Data for Community Trust</title>
        <meta
          name="description"
          content="View use of force data for Hazel Crest, IL via the Data for Community Trust project. This page shows recent and historical public safety data and insights."
        />
      </Head>

      <Script src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js" async type="module" />

      <DataPageHeader
        dataLastUpdated={new Date(USE_OF_FORCE_DATA_LAST_UPDATED_DATE)}
        title="Use of Force"
        filename="UseOfForce_page.zip"
        description="Incidents where police reported a use of force by police officers to compel compliance in a civilian interaction."
        year="2020"
      />

      <TabNavigation tabs={TABS} />

      <Box sx={{ mb: { xs: 4, md: 6 } }} />

      <OffsetHashedSection id="historical-activity">
        <UseOfForceHistoricalActivitySection useOfForceQuery={useOfForceQuery} />

        <FixedWidthContainer>
          <TableauViz
            vizId={VizURLs['UF-3'].vizId}
            sx={{ mt: 9, mb: 9 }}
            src={VizURLs['UF-3'][isProdEnv ? 'prod' : 'dev']}
          />

          <TableauViz vizId={VizURLs['UF-4'].vizId} sx={{ mb: 9 }} src={VizURLs['UF-4'][isProdEnv ? 'prod' : 'dev']} />

          {/* TODO: DATA GAP: Make this a component */}
          <Box sx={{ p: 2, backgroundColor: (theme) => theme.palette.primary.light, display: 'flex', gap: 2 }}>
            <AnnouncementIcon sx={{ mt: 0.5 }} />
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Use of Force data does not refresh automatically as data are not available in a digital format. Recent
                incidents in the last day will not display.
              </Typography>

              <Typography variant="body1">
                Use of Force data available are provided as static reports for use on this website by the Hazel Crest
                Police Department for incidents from January 1, 2020 to {USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE}.
                The Historical Activity section contains all available Use of Force data.
              </Typography>
            </Box>
          </Box>
        </FixedWidthContainer>
      </OffsetHashedSection>

      <SectionColoredDivider />

      <OffsetHashedSection id="faqs">
        <UseOfForceFAQ />
      </OffsetHashedSection>

      <InsetBoxContainer>
        <Box sx={{ display: 'flex', justifyContent: 'end', my: 6, color: 'green.main' }}>
          <DownloadDataButton dataCategory="Use of Force" filename="UseOfForce_page.zip" year="2020" />
        </Box>
      </InsetBoxContainer>
    </>
  );
}

export default UseOfForcePage;
