import { useState, useEffect } from 'react';

import { type ApiResponse, type QueryResults } from '@/constants/globals';

export type Crime = {
  id: string;
  AgencyCode: string;
  CrimeCategory: string;
  IncidentDisposition: string;
  IncidentNumber: string;
  LastUpdated: string;
  Latitude: number;
  LocalOffenseCode: string;
  LocalOffenseDescription: string;
  Location: string;
  LongTermCallID: string;
  Longitude: number;
  NIBRSCode: string;
  NIBRSCrimeAgainst: string;
  NIBRSOffense: string;
  NIBRSOffenseCategory: string;
  StatuteCode: string;
  StatuteDescription: string;
  TimeDateReported: string;
  UCRParts: string;
};

export type CrimeQueryResults = QueryResults<ApiResponse<Crime>>;

function useCrime24HR(): CrimeQueryResults {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ApiResponse<Crime>>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/data-dct/Offense_24HR.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        const processedData = jsonData.data.map((item: Crime) => ({
          ...item,
          id: item.IncidentNumber + item.LocalOffenseCode,
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

export default useCrime24HR;
