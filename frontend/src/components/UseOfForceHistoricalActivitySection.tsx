import { useRef, useState } from 'react';
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
import { isEqual } from 'lodash';
import { type Map } from 'leaflet';

import Link from '@/components/Link';
import {
  FILTER_BY_CATEGORY_INITIAL_STATE,
  ICONS_BY_CATEGORY,
  TOOLTIP_ELEMENTS,
  USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE,
} from '@/constants/useOfForce';
import { LAST_24_HOURS_TABLE_DATAGRID_SHARED_PROPS } from '@/constants/globals';
import InterpretationBlock from '@/components/InterpretationBlock';
import VizHeader from '@/components/VizHeader';
import { type UseOfForceQueryResults, type UseOfForce } from '@/hooks/useUseOfForce';
import InsetBoxContainer from '@/components/InsetBoxContainer';
import FixedWidthContainer from '@/components/layout/FixedWidthContainer';
import VizFilterByCategory from '@/components/VizFilterByCategory';
import useTrackVizViewed from '@/hooks/useTrackVizViewed';
import { sendEvent } from '@/lib/gtag';
import getIncidentCountsByCategory from '@/lib/getIncidentCountsByCategory';
import GlossaryTooltip from '@/components/GlossaryTooltip';

const MapWithNoSSR = dynamic(() => import('./map'), {
  ssr: false,
});

const columns: GridColDef<UseOfForce>[] = [
  { field: 'id' },
  { field: 'IncidentNumber', headerName: 'Incident No.', width: 100 },
  {
    field: 'IncidentDate',
    headerName: 'Date',
    width: 110,
    type: 'date',
    valueFormatter: (params) => {
      if (params.value === 'Redacted') {
        return 'Redacted';
      } else {
        return params.value;
      }
    },
  },
  {
    field: 'CallOfficerInitiated',
    headerName: 'Officer Initiated Call',
    width: 100,
  },
  {
    field: 'TypeofForce',
    headerName: 'Type of Force Used',
    width: 170,
  },
  {
    field: 'CallDisposition',
    headerName: 'Outcome',
    width: 150,
  },
  {
    field: 'Location',
    headerName: 'Approximate Location',
    minWidth: 170,
    flex: 1,
  },
];

const MAP_VIZ_ID = 'UF_Occurring_Map';
const TABLE_VIZ_ID = 'UF_Occurring_Table';

export default function UseOfForceHistoricalActivitySection({
  useOfForceQuery,
}: {
  useOfForceQuery: UseOfForceQueryResults;
}) {
  const mapRef = useRef<Map>(null);
  const gridApiRef = useGridApiRef();
  const mapContainerRef = useRef(null);
  const tableRef = useRef(null);
  useTrackVizViewed({ viz: MAP_VIZ_ID, vizRef: mapContainerRef });
  useTrackVizViewed({ viz: TABLE_VIZ_ID, vizRef: tableRef });

  const useOfForce = useOfForceQuery.data?.data ?? [];

  const [allTimeHoursFilterByCategory, setAllTimeFilterByCategory] = useState(FILTER_BY_CATEGORY_INITIAL_STATE);
  const [selectedDataPoint, setSelectedDataPoint] = useState<string | undefined>();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
    LAST_24_HOURS_TABLE_DATAGRID_SHARED_PROPS.initialState?.pagination?.paginationModel as GridPaginationModel,
  );

  const redactedUseOfForceItemsCount = useOfForce.filter((item) => item.IncidentNumber === 'Juvenile').length;

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const incidentCountsByCategory = getIncidentCountsByCategory(useOfForce, 'TypeofForce');

  const isLast24HoursFilterInitialState = isEqual(FILTER_BY_CATEGORY_INITIAL_STATE, allTimeHoursFilterByCategory);

  const filteredUseOfForceAllTimeData = isLast24HoursFilterInitialState
    ? useOfForce
    : useOfForce.filter((item) => allTimeHoursFilterByCategory[item.TypeofForce]);

  const handleApplyFilters = (selectedFilters: { [key: string]: boolean }) => {
    setAllTimeFilterByCategory(selectedFilters);
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
          Historical Activity
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          View all available{' '}
          <GlossaryTooltip definition="Incidents where police reported an “amount of effort” by police officers to compel compliance by an unwilling subject.">
            use of force
          </GlossaryTooltip>{' '}
          data over time. Please note data availability and completeness varies by year.
        </Typography>
      </InsetBoxContainer>

      <FixedWidthContainer>
        <InterpretationBlock
          dynamicText={
            <Typography variant="body1" paragraph={!isMobile}>
              There have been {useOfForce.length} use of force incidents from January 1, 2020 to{' '}
              {USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE}. The details for {redactedUseOfForceItemsCount} incidents
              were redacted due to involvement of juveniles.
            </Typography>
          }
          dataQualifier={
            <Typography variant="body2" fontStyle="italic">
              This map shows use of force incidents that occurred in this period. Locations are provided when available
              in public safety records. Markers do not indicate the exact location of an event to ensure
              confidentiality. Records related to domestic violence, medical, and mental health are not displayed to
              protect the privacy of parties involved in sensitive matters. Please see the{' '}
              <Link href="privacy-policy">Privacy Policy</Link> for more details.
            </Typography>
          }
        >
          <VizHeader title="Where Use of Force is Occurring" />

          <VizFilterByCategory
            label="Select a Use of Force Type"
            filters={allTimeHoursFilterByCategory}
            onApply={handleApplyFilters}
            initialState={FILTER_BY_CATEGORY_INITIAL_STATE}
            incidentCountsByCategory={incidentCountsByCategory}
          />

          <div ref={mapContainerRef}>
            <MapWithNoSSR
              data={filteredUseOfForceAllTimeData}
              legendTitle="Use of Force Types"
              iconsByCategory={ICONS_BY_CATEGORY}
              tooltipElements={TOOLTIP_ELEMENTS}
              groupByField="TypeofForce"
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
                rows={filteredUseOfForceAllTimeData}
                columns={columns}
                loading={useOfForceQuery.loading}
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
                      {useOfForce.length <= 0 ? 'There is no data reported for this period.' : 'No rows'}
                    </Box>
                  ),
                }}
              />
            </div>
          )}
        </InterpretationBlock>
      </FixedWidthContainer>
    </>
  );
}
