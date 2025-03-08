import { useRef, useState } from 'react';
import { Box, type Theme, Typography, useMediaQuery } from '@mui/material';
import {
  DataGrid,
  type GridRowSelectionModel,
  type GridColDef,
  type GridPaginationModel,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
  type GridEventListener,
} from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';

import Link from '@/components/Link';
import { type CrimeQueryResults, type Crime } from '@/hooks/useCrime24HR';

import { FILTER_BY_CATEGORY_INITIAL_STATE, ICONS_BY_CATEGORY, TOOLTIP_ELEMENTS } from '@/constants/crime';
import { LAST_24_HOURS_BAR_CHART_SHARED_OPTIONS, LAST_24_HOURS_TABLE_DATAGRID_SHARED_PROPS } from '@/constants/globals';
import InterpretationBlock from '@/components/InterpretationBlock';
import VizHeader from '@/components/VizHeader';
import useChartOptions from '@/hooks/useChartOptions';
import {
  formatBarChartIncidentsDataAsDynamicText,
  formatMapIncidentsDataAsDynamicText,
  getCountsByTimeOfTheDay,
} from '@/lib/formatIncidentsDataAsDynamicText';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import FixedWidthContainer from '@/components/layout/FixedWidthContainer';
import VizFilterByCategory from '@/components/VizFilterByCategory';
import useTrackVizViewed from '@/hooks/useTrackVizViewed';
import { sendEvent } from '@/lib/gtag';
import getFormattedPreviousDay from '@/lib/getFormattedPreviousDay';
import { type Map } from 'leaflet';
import getIncidentCountsByCategory from '@/lib/getIncidentCountsByCategory';
import GlossaryTooltip from '@/components/GlossaryTooltip';

const MapWithNoSSR = dynamic(() => import('../components/map'), {
  ssr: false,
});

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const columns: GridColDef<Crime>[] = [
  { field: 'id' },
  { field: 'IncidentNumber', headerName: 'Incident No.', width: 100 },
  {
    field: 'TimeDateReported',
    headerName: 'Time',
    width: 90,
    type: 'date',
    valueGetter: (params) => new Date(params.value),
    valueFormatter: (params) => dayjs(params.value).format('h:mm A'),
  },
  {
    field: 'CrimeCategory',
    headerName: 'Crime Type',
    width: 140,
  },
  {
    field: 'LocalOffenseDescription',
    headerName: 'Nature of Incident',
    width: 140,
  },
  {
    field: 'IncidentDisposition',
    headerName: 'Outcome',
    width: 140,
  },
  {
    field: 'Location',
    headerName: 'Approximate Location',
    minWidth: 180,
    flex: 1,
  },
];

const MAP_VIZ_ID = 'CR_CrimeOccurring_Map';
const TABLE_VIZ_ID = 'CR_CrimeOccurring_Table';
const BARCHART_VIZ_ID = 'CR_TimeofDay_Recent';

export default function Crime24HRSection({ crimeQuery }: { crimeQuery: CrimeQueryResults }) {
  const mapRef = useRef<Map>(null);
  const gridApiRef = useGridApiRef();
  const mapContainerRef = useRef(null);
  const tableRef = useRef(null);
  const barChartRef = useRef(null);

  useTrackVizViewed({ viz: MAP_VIZ_ID, vizRef: mapContainerRef });
  useTrackVizViewed({ viz: TABLE_VIZ_ID, vizRef: tableRef });
  useTrackVizViewed({ viz: BARCHART_VIZ_ID, vizRef: barChartRef });

  const [last24HoursFilterByCategory, setLast24HoursFilterByCategory] = useState(FILTER_BY_CATEGORY_INITIAL_STATE);
  const [selectedDataPoint, setSelectedDataPoint] = useState<string | undefined>();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
    LAST_24_HOURS_TABLE_DATAGRID_SHARED_PROPS.initialState?.pagination?.paginationModel as GridPaginationModel,
  );

  const crimes = crimeQuery.data?.data ?? [];

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const chartOptions = useChartOptions({
    ...LAST_24_HOURS_BAR_CHART_SHARED_OPTIONS,
    yaxis: {
      ...LAST_24_HOURS_BAR_CHART_SHARED_OPTIONS.yaxis,
      title: {
        text: 'Number of Crimes',
      },
    },
  });

  const incidentCountsByCategory = getIncidentCountsByCategory(crimes, 'CrimeCategory');
  const isLast24HoursFilterInitialState = isEqual(FILTER_BY_CATEGORY_INITIAL_STATE, last24HoursFilterByCategory);

  const filteredCrimesLast24hoursData = isLast24HoursFilterInitialState
    ? crimes
    : crimes.filter((item) => last24HoursFilterByCategory[item.CrimeCategory]);

  const handleApplyFilters = (selectedFilters: { [key: string]: boolean }) => {
    setLast24HoursFilterByCategory(selectedFilters);
    sendEvent('viz_filter_changed', {
      target: MAP_VIZ_ID,
    });
  };

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
          <GlossaryTooltip definition="Reported incidents with violations of law.">crimes</GlossaryTooltip> that
          occurred on {getFormattedPreviousDay(crimeQuery.data?.date_last_updated ?? '')}, between 12:00am and 11:59pm
          CT.
        </Typography>
      </InsetBoxContainer>

      <FixedWidthContainer>
        <InterpretationBlock
          sx={{ mb: 4 }}
          dynamicText={
            <Typography variant="body1" paragraph={!isMobile}>
              {formatMapIncidentsDataAsDynamicText<Crime>({
                data: crimes,
                filterKey: 'CrimeCategory',
                incidentTypeSingular: 'crime',
                incidentTypePlural: 'crimes',
                dateString: crimeQuery.data?.date_last_updated ?? '',
              })}
            </Typography>
          }
          dataQualifier={
            <Typography variant="body2" fontStyle="italic">
              This map shows crimes that occurred on {getFormattedPreviousDay(crimeQuery.data?.date_last_updated ?? '')}
              . Locations are provided when available in public safety records. Markers do not indicate the exact
              location of an event to ensure confidentiality. Records related to domestic violence, medical, and mental
              health are not displayed to protect the privacy of parties involved in sensitive matters. Please see the{' '}
              <Link href="/privacy-policy">Privacy Policy</Link> for more details.
            </Typography>
          }
        >
          <VizHeader title="Where Crime was Reported" />

          <VizFilterByCategory
            label="Select a Crime Type"
            filters={last24HoursFilterByCategory}
            onApply={handleApplyFilters}
            initialState={FILTER_BY_CATEGORY_INITIAL_STATE}
            incidentCountsByCategory={incidentCountsByCategory}
          />

          <div ref={mapContainerRef}>
            <MapWithNoSSR
              data={filteredCrimesLast24hoursData}
              legendTitle="Crime Types"
              iconsByCategory={ICONS_BY_CATEGORY}
              tooltipElements={TOOLTIP_ELEMENTS}
              groupByField="CrimeCategory"
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
                rows={filteredCrimesLast24hoursData}
                columns={columns}
                loading={crimeQuery.loading}
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
                      {crimes.length <= 0 ? 'There is no data reported for this period.' : 'No rows'}
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
              {formatBarChartIncidentsDataAsDynamicText<Crime>({
                data: crimes,
                filterKey: 'TimeDateReported',
                incidentTypeSingular: 'crime',
                incidentTypePlural: 'crimes',
                dateString: crimeQuery.data?.date_last_updated ?? '',
              })}
            </Typography>
          }
          dataQualifier={
            <Typography variant="body2" fontStyle="italic">
              This chart displays morning (6am–12pm), afternoon (12pm–6pm), evening (6pm–12am), late night (12am–6am)
              crimes that occurred on {getFormattedPreviousDay(crimeQuery.data?.date_last_updated ?? '')}.
            </Typography>
          }
        >
          <VizHeader title="When Crime was Reported" />

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
                  name: 'Number of Crimes',
                  data: Object.values(getCountsByTimeOfTheDay(crimes)),
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
