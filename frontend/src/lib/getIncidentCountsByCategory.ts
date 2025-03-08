import { type IncidentReport } from '@/types';

function getIncidentCountsByCategory<T extends IncidentReport>(incidents: T[], categoryKey: keyof T) {
  const categoryCounts: Record<string, number> = {};

  incidents.forEach((incident) => {
    const category = String(incident[categoryKey]);
    if (categoryCounts[category]) {
      categoryCounts[category]++;
    } else {
      categoryCounts[category] = 1;
    }
  });

  return categoryCounts;
}

export default getIncidentCountsByCategory;
