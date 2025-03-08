import { useState, useEffect } from 'react';

import { type ApiResponse, type QueryResults } from '@/constants/globals';

export type UseOfForce = {
  id: string;
  Index: number;
  IncidentNumber: string;
  TimeDateReported: string;
  Zone: string;
  TypeofForce: string;
  CallCategory: string;
  Notes: string;
  CallOfficerInitiated: string;
  CallDisposition: string;
  OfficerName: string;
  SubjectWeapons: string | null;
  SubjectRaceEthnicity: string;
  SubjectSex: string;
  AgeGroup: string;
  Latitude: number;
  Longitude: number;
  Location: string;
  LastUpdated: string;
};

export type UseOfForceQueryResults = QueryResults<ApiResponse<UseOfForce>>;

function useUseOfForce(): UseOfForceQueryResults {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ApiResponse<UseOfForce>>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/data-dct/UseOfForce.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData({
          ...jsonData,
          data: jsonData.data.map((item: UseOfForce) => {
            if (item.TypeofForce !== 'J')
              return {
                ...item,
                id: item.Index,
              };
            return {
              ...item,
              id: item.Index,
              IncidentNumber: 'Juvenile',
              IncidentDate: 'Redacted',
              TimeDateReported: 'Redacted',
              CallCategory: 'Redacted',
              Notes: 'Redacted',
              CallOfficerInitiated: 'Redacted',
              CallDisposition: 'Redacted',
              OfficerName: 'Redacted',
              AgeGroup: 'Redacted',
              Zone: 'Redacted',
              Location: 'Redacted',
              Longitude: null,
              Latitude: null,
              LastUpdated: 'Redacted',
            };
          }),
        });
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

export default useUseOfForce;
