import { useState, useEffect } from 'react';

import { type QueryResults } from '@/constants/globals';

export type ZoneData = {
  calls_for_service: {
    last_7_days_incidents_count: number;
    past_year_weekly_avg_incidents_count: number;
  };
  crimes: {
    last_7_days_incidents_count: number;
    past_year_weekly_avg_incidents_count: number;
  };
  traffic_stops: {
    last_7_days_incidents_count: number;
    past_year_weekly_avg_incidents_count: number;
  };
};

export type IncidentCountsData = {
  data_last_updated: string;
  start_date: string;
  end_date: string;
  'Zone 1': ZoneData;
  'Zone 2': ZoneData;
  'Zone 3': ZoneData;
};

function useIncidentCounts(): QueryResults<IncidentCountsData> {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<IncidentCountsData>({
    start_date: '',
    end_date: '',
    data_last_updated: '',
    'Zone 1': {
      calls_for_service: {
        last_7_days_incidents_count: 0,
        past_year_weekly_avg_incidents_count: 0,
      },
      crimes: {
        last_7_days_incidents_count: 0,
        past_year_weekly_avg_incidents_count: 0,
      },
      traffic_stops: {
        last_7_days_incidents_count: 0,
        past_year_weekly_avg_incidents_count: 0,
      },
    },
    'Zone 2': {
      calls_for_service: {
        last_7_days_incidents_count: 0,
        past_year_weekly_avg_incidents_count: 0,
      },
      crimes: {
        last_7_days_incidents_count: 0,
        past_year_weekly_avg_incidents_count: 0,
      },
      traffic_stops: {
        last_7_days_incidents_count: 0,
        past_year_weekly_avg_incidents_count: 0,
      },
    },
    'Zone 3': {
      calls_for_service: {
        last_7_days_incidents_count: 0,
        past_year_weekly_avg_incidents_count: 0,
      },
      crimes: {
        last_7_days_incidents_count: 0,
        past_year_weekly_avg_incidents_count: 0,
      },
      traffic_stops: {
        last_7_days_incidents_count: 0,
        past_year_weekly_avg_incidents_count: 0,
      },
    },
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/data-dct/LandingPageStats.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, data, error };
}

export default useIncidentCounts;
