import Head from 'next/head';
import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  MenuItem,
  type Theme,
  Typography,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';

import useChartOptions from '@/hooks/useChartOptions';
import InterpretationBlock from '@/components/InterpretationBlock';
import Link from '@/components/Link';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import HazelCrestLogo2 from '../../public/assets/images/hazel-crest-logo-2.png';
import ExploreDataCard from '@/components/ExploreDataCard';
import useIncidentCounts, { type ZoneData } from '@/hooks/useIncidentCounts';
import DataLastUpdatedText from '@/components/DataLastUpdatedText';
import { sendEvent } from '@/lib/gtag';
import GlossaryTooltip from '@/components/GlossaryTooltip';

function getLastWeekRangeText(customDate?: string) {
  const startDate = customDate ? dayjs(customDate).subtract(6, 'day') : dayjs().subtract(6, 'day');
  const endDate = customDate ? dayjs(customDate) : dayjs();

  const startMonth = startDate.format('MMMM');
  const endMonth = endDate.format('MMMM');

  const startDay = startDate.format('D');
  const endDay = endDate.format('D');

  const year = startDate.format('YYYY');

  return `${startMonth} ${startDay} to ${endMonth} ${endDay}, ${year}`;
}

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const INCIDENT_TYPE_MAP: Record<keyof ZoneData, string> = {
  calls_for_service: 'Calls for Service',
  crimes: 'Crime',
  traffic_stops: 'Traffic Stops',
};

const INCIDENT_TYPE_MAP_2: Record<keyof ZoneData, string> = {
  calls_for_service: 'calls for service',
  crimes: 'crimes',
  traffic_stops: 'traffic stops',
};

const INCIDENT_TYPE_DEFINITION_MAP: Record<keyof ZoneData, string> = {
  calls_for_service: 'A request for police assistance that resulted in a police response.',
  crimes: 'Reported incidents with violations of law.',
  traffic_stops:
    'When a police officer temporarily detains a driver and their passengers to investigate a minor violation or potential crime. They are also known as being pulled over.  ',
};

export default function Home() {
  const [selectedIncidentType, setSelectedIncidentType] = useState<keyof ZoneData>('calls_for_service');

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const incidentCounts = useIncidentCounts();

  const chartOptions = useChartOptions({
    chart: {
      height: 600,
      type: 'bar',
    },

    xaxis: {
      categories: ['Zone 1', 'Zone 2', 'Zone 3'],
    },

    yaxis: {
      title: {
        text: 'Number of Incidents',
      },
    },

    tooltip: {
      fixed: {
        enabled: isMobile,
        position: 'topLeft',
        offsetY: 20,
        offsetX: 20,
      },
    },
  });

  const handleChangeSelectedIncidentType = (event: SelectChangeEvent) => {
    setSelectedIncidentType(event.target.value as keyof ZoneData);
    sendEvent('change_incident_type', {
      target: event.target.value,
    });
  };
  return (
    <>
      <Head>
        <title>Data for Community Trust</title>
        <meta
          name="description"
          content="Data for Community Trust provides communities actionable information on public safety activity. View the latest public safety data for Hazel Crest, IL."
        />
      </Head>

      <Box
        sx={{
          position: 'relative',
          background: 'url("/assets/images/HazelCrestHeader@1x.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'green.main',
          color: 'white',
          py: 6,
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
        <InsetBoxContainer>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'center', lg: 'end' },
                flexGap: 16,
                gap: 2,
                justifyContent: 'space-between',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box>
                <Typography component="h1" variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                  <Typography component="span" variant="h6" sx={{ mb: 1, fontWeight: 'regular', display: 'block' }}>
                    Public safety data for
                  </Typography>
                  Village of Hazel Crest, IL
                </Typography>
                <DataLastUpdatedText
                  dataLastUpdated={
                    incidentCounts.data.data_last_updated ? new Date(incidentCounts.data.data_last_updated) : new Date()
                  }
                />
              </Box>
              <a href="https://villageofhazelcrest.org/" target="_blank">
                <Image alt="Hazel Crest logo" src={HazelCrestLogo2} width={120} height={120} />
              </a>
            </Box>
          </Box>
        </InsetBoxContainer>
      </Box>

      <Box sx={{ mb: { xs: 4, md: 6 } }} />

      <Box component="section">
        <InsetBoxContainer>
          <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
            About Data for Community Trust
          </Typography>

          <Typography variant="body1">
            Data for Community Trust provides communities information on crime and public safety activity. The goal is
            to inform transparent, actionable conversations between community members and the public safety agencies
            that serve them.
          </Typography>
        </InsetBoxContainer>
      </Box>

      <Box height={16} bgcolor="secondary.main" sx={{ mt: { xs: 7, md: 7 }, mb: { xs: 7, md: 7 } }} />

      <InsetBoxContainer>
        <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
          Local Snapshot
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          View activity by Hazel Crest{' '}
          <GlossaryTooltip definition="The subdivisions and neighborhoods that make up the Village of Hazel Crest are divided into three zones.">
            zone
          </GlossaryTooltip>{' '}
          in the last seven days compared to weekly averages over the last year.
        </Typography>
      </InsetBoxContainer>

      <Container maxWidth={false}>
        <InterpretationBlock
          sx={{ mb: 4 }}
          dynamicText={
            <>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 2.5 }}>
                {getLastWeekRangeText(incidentCounts.data.end_date)}
              </Typography>

              {['Zone 1', 'Zone 2', 'Zone 3'].map((zone, index) => (
                <div key={zone}>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {zone}
                  </Typography>

                  <Typography variant="body1" paragraph={!(isMobile && zone === 'Zone 3')}>
                    {/* @ts-expect-error improve types  */}
                    There were {incidentCounts.data[zone][selectedIncidentType].last_7_days_incidents_count}{' '}
                    {index === 0 ? (
                      <GlossaryTooltip definition={INCIDENT_TYPE_DEFINITION_MAP[selectedIncidentType]}>
                        {INCIDENT_TYPE_MAP_2[selectedIncidentType]}
                      </GlossaryTooltip>
                    ) : (
                      INCIDENT_TYPE_MAP_2[selectedIncidentType]
                    )}{' '}
                    (compared to {/* @ts-expect-error improve types  */}
                    {incidentCounts.data[zone][selectedIncidentType].past_year_weekly_avg_incidents_count}{' '}
                    {INCIDENT_TYPE_MAP_2[selectedIncidentType]} per week on average over the past year).
                  </Typography>
                </div>
              ))}
            </>
          }
          dataQualifier={
            <Typography variant="body2" fontStyle="italic">
              This chart shows weekly public safety data by neighborhood zone for Hazel Crest, IL. This chart can be
              filtered by incident type.
              <Link href="/methodology/#hazel-crest-zone" sx={{ display: 'inline-block', mt: 2 }}>
                See the map of Hazel Crest zones.
              </Link>
            </Typography>
          }
        >
          <InputLabel
            shrink={false}
            id="incident-type-select-label"
            sx={{ fontSize: '12px', color: 'black', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
          >
            Select an Incident Type
            <FormControl id="incident-type-select" size="small" sx={{ minWidth: 200 }}>
              <Select
                labelId="incident-type-select-label"
                id="incident-type-select"
                value={selectedIncidentType}
                onChange={handleChangeSelectedIncidentType}
                sx={{ fontSize: '14px' }}
                name="incident type"
              >
                {Object.keys(INCIDENT_TYPE_MAP).map((key) => (
                  <MenuItem key={key} value={key}>
                    {INCIDENT_TYPE_MAP[key as keyof ZoneData]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </InputLabel>

          <Box
            sx={{
              minHeight: 400,
              '.apexcharts-bar-area:hover': { stroke: 'black !important', strokeWidth: 1 },
              '.apexcharts-xcrosshairs': { display: 'none' },
            }}
          >
            <ReactApexChart
              type="bar"
              height={chartOptions.chart?.height}
              width={chartOptions.chart?.width}
              series={[
                {
                  name: 'Incidents in the past seven days',
                  data: [
                    incidentCounts.data['Zone 1'][selectedIncidentType].last_7_days_incidents_count,
                    incidentCounts.data['Zone 2'][selectedIncidentType].last_7_days_incidents_count,
                    incidentCounts.data['Zone 3'][selectedIncidentType].last_7_days_incidents_count,
                  ],
                },
                {
                  name: 'Average weekly incidents this past year',
                  data: [
                    incidentCounts.data['Zone 1'][selectedIncidentType].past_year_weekly_avg_incidents_count,
                    incidentCounts.data['Zone 2'][selectedIncidentType].past_year_weekly_avg_incidents_count,
                    incidentCounts.data['Zone 3'][selectedIncidentType].past_year_weekly_avg_incidents_count,
                  ],
                },
              ]}
              options={chartOptions}
            />
          </Box>
        </InterpretationBlock>
      </Container>

      <Box component="section" sx={{ backgroundColor: (theme) => theme.palette.primary.main, py: 7 }}>
        <InsetBoxContainer>
          <Typography component="h2" variant="h4" fontWeight="bold" sx={{ mb: 3, color: 'white' }}>
            Explore the data
          </Typography>

          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} lg={6}>
              <ExploreDataCard
                title="Calls for Service"
                description="911 calls and calls to non-emergency numbers that required a police response."
                link="/calls-for-service"
                imagePath="/assets/images/cfs-card-img.png"
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <ExploreDataCard
                title="Crime"
                description="Reported incidents with violations of law."
                link="/crime"
                imagePath="/assets/images/cr-card-img.png"
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <ExploreDataCard
                title="Traffic Stops"
                description="Incidents where civilians were stopped for suspected violation of traffic laws."
                link="/traffic-stops"
                imagePath="/assets/images/tfs-card-img.jpg"
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <ExploreDataCard
                title="Use of Force"
                description="Incidents where police reported a use of force by police officers to compel compliance in a civilian interaction."
                link="/use-of-force"
                imagePath="/assets/images/uof-card-img.png"
              />
            </Grid>
          </Grid>
        </InsetBoxContainer>
      </Box>
    </>
  );
}
