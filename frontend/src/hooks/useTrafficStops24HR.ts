import { useState, useEffect } from 'react';

import { type QueryResults } from '@/constants/globals';

export type TrafficStop = {
  id: string;
  AgencyCode: string;
  CityCode: string;
  LastUpdated: string;
  Latitude: number;
  Longitude: number;
  Location: string;
  LongTermCallID: string;
  Occurred: string;
  IncidentNumber: string;
  TimeDateReported: string;
};

type ApiResponse<IncidentType> =
  | {
      date_last_updated: string;
      data: IncidentType[];
    }
  | undefined;

export type TrafficStopQueryResults = QueryResults<ApiResponse<TrafficStop>>;

function useTrafficStops24HR(): TrafficStopQueryResults {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ApiResponse<TrafficStop>>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/data-dct/TrafficStops_24HR.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        const processedData = jsonData.data.map((item: TrafficStop) => ({
          ...item,
          TimeDateReported: item.Occurred,
          id: item.IncidentNumber,
        }));
        setData({ ...jsonData, data: processedData });
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

export default useTrafficStops24HR;
