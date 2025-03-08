import { Box, type Theme, Typography, useMediaQuery } from '@mui/material';
import {
  DataGrid,
  useGridApiRef,
  type GridColDef,
  type GridRowSelectionModel,
  type GridPaginationModel,
  gridFilteredSortedRowIdsSelector,
  type GridEventListener,
} from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { type Map } from 'leaflet';

import useChartOptions from '@/hooks/useChartOptions';
import Link from '@/components/Link';
import { ICONS_BY_CATEGORY, TOOLTIP_ELEMENTS } from '@/constants/trafficStops';
import { LAST_24_HOURS_BAR_CHART_SHARED_OPTIONS, LAST_24_HOURS_TABLE_DATAGRID_SHARED_PROPS } from '@/constants/globals';
import InterpretationBlock from '@/components/InterpretationBlock';
import VizHeader from '@/components/VizHeader';
import CountByTimeOfTheDayDynamicText from '@/components/CountByTimeOfTheDayDynamicText';
import { type TrafficStopQueryResults, type TrafficStop } from '@/hooks/useTrafficStops24HR';
import { getCountsByTimeOfTheDay } from '@/lib/formatIncidentsDataAsDynamicText';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import FixedWidthContainer from '@/components/layout/FixedWidthContainer';
import getFormattedPreviousDay from '@/lib/getFormattedPreviousDay';
import { useRef, useState } from 'react';
import useTrackVizViewed from '@/hooks/useTrackVizViewed';
import { sendEvent } from '@/lib/gtag';
import GlossaryTooltip from '@/components/GlossaryTooltip';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const MapWithNoSSR = dynamic(() => import('../components/map'), {
  ssr: false,
});

const columns: GridColDef<TrafficStop>[] = [
  { field: 'id' },
  { field: 'IncidentNumber', headerName: 'Incident No.', width: 130 },
  {
    field: 'TimeDateReported',
    headerName: 'Time',
    width: 90,
    type: 'date',
    valueGetter: (params) => new Date(params.value),
    valueFormatter: (params) => dayjs(params.value).format('h:mm A'),
  },
  {
    field: 'Location',
    headerName: 'Approximate Location',
    minWidth: 200,
    flex: 1,
  },
];

const MAP_VIZ_ID = 'TS_Occurring_Map';
const TABLE_VIZ_ID = 'TS_Occurring_Table';
const BARCHART_VIZ_ID = 'TS_TimeofDay_Recent';

export default function TrafficStops24HRSection({ trafficStopsQuery }: { trafficStopsQuery: TrafficStopQueryResults }) {
  const mapRef = useRef<Map>(null);
  const gridApiRef = useGridApiRef();
  const mapContainerRef = useRef(null);
  const tableRef = useRef(null);
  const barChartRef = useRef(null);

  useTrackVizViewed({ viz: MAP_VIZ_ID, vizRef: mapContainerRef });
  useTrackVizViewed({ viz: TABLE_VIZ_ID, vizRef: tableRef });
  useTrackVizViewed({ viz: BARCHART_VIZ_ID, vizRef: barChartRef });

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const trafficStops = trafficStopsQuery.data?.data ?? [];

  const [selectedDataPoint, setSelectedDataPoint] = useState<string | undefined>();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
    LAST_24_HOURS_TABLE_DATAGRID_SHARED_PROPS.initialState?.pagination?.paginationModel as GridPaginationModel,
  );

  const chartOptions = useChartOptions({
    ...LAST_24_HOURS_BAR_CHART_SHARED_OPTIONS,
    yaxis: {
      ...LAST_24_HOURS_BAR_CHART_SHARED_OPTIONS.yaxis,
      title: {
        text: 'Number of Traffic Stops',
      },
    },
  });

  const mostRecentTimeDateReportedString = trafficStopsQuery.data?.date_last_updated;

  // Focus map marker and highlight table row
  const handleMarkerClick = (rowId: string) => {
    setSelectedDataPoint(rowId);

    if (!isMobile) {
      setRowSelectionModel(Boolean(rowId) ? [rowId] : []);
      const rowIndex = gridFilteredSortedRowIdsSelector(gridApiRef).findIndex((_rowId) => _rowId === rowId);
      setPaginationModel((prevState) => ({ ...prevState, page: Math.floor(rowIndex / prevState.pageSize) }));
    }
  };

  // Focus and zoom map marker when user clicks a row on the table
  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    if (params.row.Latitude && params.row.Longitude && Boolean(mapRef.current)) {
      if (mapRef.current) {
        mapRef?.current.setView([params.row.Latitude, params.row.Longitude], 15);
      }
      setSelectedDataPoint(params.row.id);
    } else {
      setSelectedDataPoint(undefined);
    }
  };

  return (
    <>
      <InsetBoxContainer>
        <Typography component="h2" variant="h4" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
          Recent Activity
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          View available{' '}
          <GlossaryTooltip definition="When a police officer temporarily detains a driver and their passengers to investigate a minor violation or potential crime. They are also known as being pulled over.">
            traffic stops
          </GlossaryTooltip>{' '}
          that occurred on {getFormattedPreviousDay(trafficStopsQuery.data?.date_last_updated ?? '')}, between 12:00am
          and 11:59pm CT.
        </Typography>
      </InsetBoxContainer>

      <FixedWidthContainer>
        <InterpretationBlock
          sx={{ mb: 4 }}
          dynamicText={
            <Typography variant="body1" paragraph={!isMobile}>
              {trafficStops.length > 0 ? (
                <> There have been {trafficStops.length} traffic stops in this period.</>
              ) : (
                <>
                  There were zero traffic stops on{' '}
                  {getFormattedPreviousDay(trafficStopsQuery.data?.date_last_updated ?? '')}.
                </>
              )}
            </Typography>
          }
          dataQualifier={
            <Typography variant="body2" fontStyle="italic">
              This map shows traffic stops that occurred on{' '}
              {getFormattedPreviousDay(trafficStopsQuery.data?.date_last_updated ?? '')}. Locations are provided when
              available in public safety records. Markers do not indicate the exact location of an event to ensure
              confidentiality. Records related to domestic violence, medical, and mental health are not displayed to
              protect the privacy of parties involved in sensitive matters. Please see the{' '}
              <Link href="privacy-policy">Privacy Policy</Link> for more details.
            </Typography>
          }
        >
          <VizHeader title="Where Traffic Stops are Occurring" />

          <div ref={mapContainerRef}>
            <MapWithNoSSR
              data={trafficStops}
              iconsByCategory={ICONS_BY_CATEGORY}
              tooltipElements={TOOLTIP_ELEMENTS}
              groupByField="Traffic"
              individualCategory
              vizId={MAP_VIZ_ID}
              mapRef={mapRef}
              selectedDataPoint={selectedDataPoint}
              handleMarkerClick={handleMarkerClick}
            />
          </div>

          {!isMobile && (
            <div style={{ width: '100%' }} ref={tableRef}>
              <DataGrid
                {...LAST_24_HOURS_TABLE_DATAGRID_SHARED_PROPS}
                apiRef={gridApiRef}
                rows={trafficStops}
                columns={columns}
                loading={trafficStopsQuery.loading}
                getRowHeight={undefined}
                onSortModelChange={() => sendEvent('table_sort', { target: TABLE_VIZ_ID })}
                paginationModel={paginationModel}
                onPaginationModelChange={(newPaginationModel) => {
                  setPaginationModel(newPaginationModel);
                  sendEvent('table_change_page', { target: TABLE_VIZ_ID });
                }}
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setRowSelectionModel(newRowSelectionModel);
                }}
                onRowClick={handleRowClick}
                slots={{
                  noRowsOverlay: () => (
                    <Box display="flex" height="100%" alignItems="center" justifyContent="center">
                      {trafficStops.length <= 0 ? 'There is no data reported for this period.' : 'No rows'}
                    </Box>
                  ),
                }}
              />
            </div>
          )}
        </InterpretationBlock>

        <InterpretationBlock
          dynamicText={
            <Typography variant="body1" paragraph={!isMobile}>
              <CountByTimeOfTheDayDynamicText
                counts={Object.values(getCountsByTimeOfTheDay(trafficStops))}
                activity="traffic stop(s)"
                dateString={mostRecentTimeDateReportedString ?? ''}
              />
            </Typography>
          }
          dataQualifier={
            <Typography variant="body2" fontStyle="italic">
              This chart displays morning (6am–12pm), afternoon (12pm–6pm), evening (6pm–12am), late night (12am–6am)
              traffic stops that occurred on {getFormattedPreviousDay(trafficStopsQuery.data?.date_last_updated ?? '')}.
            </Typography>
          }
        >
          <VizHeader title="When Traffic Stops are Occurring" />

          <Box
            sx={{
              minHeight: 400,
              '.apexcharts-bar-area:hover': { stroke: 'black !important', strokeWidth: 1 },
              '.apexcharts-xcrosshairs': { display: 'none' },
            }}
            ref={barChartRef}
          >
            <ReactApexChart
              type="bar"
              height={chartOptions.chart?.height}
              width={chartOptions.chart?.width}
              series={[
                {
                  name: 'Number of Traffic Stops',
                  data: Object.values(getCountsByTimeOfTheDay(trafficStops)),
                },
              ]}
              options={chartOptions}
            />
          </Box>
        </InterpretationBlock>
      </FixedWidthContainer>
    </>
  );
}
