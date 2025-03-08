import { useState, useEffect } from 'react';

import { type ApiResponse, type QueryResults } from '@/constants/globals';

export type CallForService = {
  id: string;
  RecordNumber: string;
  TimeDateReported: string;
  CallPriority: number;
  CityCode: string;
  CallMethod: string;
  CallNature: string;
  CallType: string;
  IncidentNumber: string;
  AgencyCode: string;
  Longitude: number;
  Latitude: number;
  Location: string;
  LastUpdated: string;
};

export type CallForServiceQueryResults = QueryResults<ApiResponse<CallForService>>;

function useCallsForService24HR(): CallForServiceQueryResults {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ApiResponse<CallForService>>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/data-dct/CallsForService_24HR.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        const processedData = jsonData.data.map((item: CallForService) => ({
          ...item,
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

export default useCallsForService24HR;
