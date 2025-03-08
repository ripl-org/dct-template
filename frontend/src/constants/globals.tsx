import { type DataGridProps } from '@mui/x-data-grid';
import { type ApexOptions } from 'apexcharts';

export const LAST_24_HOURS_TABLE_DATAGRID_SHARED_PROPS: DataGridProps = {
  rows: [],
  columns: [],
  columnVisibilityModel: {
    id: false,
  },
  initialState: {
    pagination: {
      paginationModel: {
        page: 0,
        pageSize: 5,
      },
    },
  },
  pageSizeOptions: [5],
  disableColumnMenu: true,
  getRowHeight: () => 'auto',
  autoHeight: true,
  sx: {
    mt: 0.5,
    '& .MuiDataGrid-columnHeaderTitle': {
      textOverflow: 'clip',
      whiteSpace: 'break-spaces',
      lineHeight: 1.2,
    },
  },
};

export const LAST_24_HOURS_BAR_CHART_SHARED_OPTIONS: ApexOptions = {
  chart: {
    height: '100%',
    type: 'bar',
  },

  xaxis: {
    categories: [
      ['Morning', '(6AM–12PM)'],
      ['Afternoon', '(12PM–6PM)'],
      ['Evening', '(6PM–12AM)'],
      ['Late Night', '(12AM–6AM)'],
    ],
  },

  yaxis: {
    max: (max) => max + 1,
    labels: {
      formatter: function (val) {
        return val.toFixed(0);
      },
    },
  },
};

type Item = Record<string, unknown>; // Define the type for items

export function getCountsByCategory<T extends Item>(
  items: T[],
  categoryKey: keyof T,
): { category: string; count: number }[] {
  const counts: { [category: string]: number } = {};

  // Count occurrences of each category
  items.forEach((item: T) => {
    const category = item[categoryKey] as string;
    counts[category] = (counts[category] || 0) + 1;
  });

  // Convert counts to an array of objects
  const countsArray = Object.entries(counts)
    .filter(([_, count]) => count > 0) // Filter out categories with zero counts
    .map(([category, count]) => ({ category, count }));

  // Sort counts array by count in descending order
  countsArray.sort((a, b) => b.count - a.count);

  return countsArray;
}

export const DATA_UPDATES_DAILY_COPY = 'Data updates daily at 12:00am CT.';

export type QueryResults<Data> = {
  loading: boolean;
  data: Data;
  error: string | null;
};

export type ApiResponse<IncidentType> =
  | {
      date_last_updated: string;
      data: IncidentType[];
    }
  | undefined;
