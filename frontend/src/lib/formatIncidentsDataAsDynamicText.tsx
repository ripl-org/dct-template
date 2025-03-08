import getFormattedPreviousDay from '@/lib/getFormattedPreviousDay';
import { isEqual } from 'lodash';

interface IncidentReport {
  TimeDateReported: string; // Assuming TimeDateReported is a string representing time
}

const COPY_BY_TIME_OF_THE_DAY: { [key: string]: string } = {
  Morning: 'Morning (6am–12pm)',
  Afternoon: 'Afternoon (12pm–6pm)',
  Evening: 'Evening (6pm–12am)',
  Night: 'Late Night (12am–6am)',
};

export function getCountsByTimeOfTheDay<T extends IncidentReport>(incidents: T[]): Record<string, number> {
  const counts = {
    Morning: 0,
    Afternoon: 0,
    Evening: 0,
    Night: 0,
  };

  incidents.forEach((incident) => {
    const time = new Date(incident.TimeDateReported).getHours();

    if (time >= 6 && time < 12) {
      counts.Morning++;
    } else if (time >= 12 && time < 18) {
      counts.Afternoon++;
    } else if (time >= 18 && time < 24) {
      counts.Evening++;
    } else {
      counts.Night++;
    }
  });

  return counts;
}

interface IncidentsFrequency {
  mostFrequentIncidentCategories: { count: number; categories: string[] };
  leastFrequentIncidentCategories: { count: number; categories: string[] };
}

function getIncidentsFrequencyByCategory<T extends IncidentReport>(
  incidents: T[],
  categoryKey: keyof T,
): IncidentsFrequency {
  let categoryCounts: Record<string, number> = {};

  if (categoryKey === 'TimeDateReported') {
    categoryCounts = getCountsByTimeOfTheDay(incidents);
  } else {
    // Count occurrences of each category
    incidents.forEach((incident) => {
      const category = String(incident[categoryKey]);
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });
  }

  const categories = Object.keys(categoryCounts);
  const sortedCategories = categories.sort((a, b) => categoryCounts[b] - categoryCounts[a]);

  const mostFrequentCount = categoryCounts[sortedCategories[0]];
  const mostFrequentCategories: string[] = [];
  const leastFrequentCount = categoryCounts[sortedCategories[sortedCategories.length - 1]];
  const leastFrequentCategories: string[] = [];

  // Find most and least frequent categories
  sortedCategories.forEach((category) => {
    if (categoryCounts[category] === mostFrequentCount) {
      mostFrequentCategories.push(category);
    }
    if (categoryCounts[category] === leastFrequentCount) {
      leastFrequentCategories.push(category);
    }
  });

  return {
    mostFrequentIncidentCategories: { count: mostFrequentCount, categories: mostFrequentCategories },
    leastFrequentIncidentCategories: { count: leastFrequentCount, categories: leastFrequentCategories },
  };
}

export interface Params<T> {
  data: T[];
  filterKey: keyof T;
  incidentTypeSingular: string;
  incidentTypePlural: string;
  dateString: string;
}

export function formatMapIncidentsDataAsDynamicText<T extends IncidentReport>({
  data,
  filterKey,
  incidentTypeSingular,
  incidentTypePlural,
  dateString,
}: Params<T>) {
  const totalIncidents = data.length;

  const { mostFrequentIncidentCategories, leastFrequentIncidentCategories } = getIncidentsFrequencyByCategory(
    data,
    filterKey,
  );

  // Case 0 total incidents: There have been 0 crimes in this period.
  if (totalIncidents === 0) {
    return (
      <>
        There were zero {incidentTypePlural} on {getFormattedPreviousDay(dateString)}.
      </>
    );
  }

  // Case 1 incident: There has been 1 crime in this period, the crime type was [CrimeType].
  if (totalIncidents === 1) {
    return (
      <>
        There has been {totalIncidents} {incidentTypeSingular} in this period, the {incidentTypeSingular} type was{' '}
        {data[0][filterKey]}.
      </>
    );
  }

  // Multiple incidents with unique category
  if (
    isEqual(mostFrequentIncidentCategories.categories, leastFrequentIncidentCategories.categories) &&
    mostFrequentIncidentCategories.categories.length == 1
  ) {
    return (
      <>
        There have been {totalIncidents} {incidentTypePlural} in this period, the {incidentTypeSingular} type was{' '}
        {data[0][filterKey]}.
      </>
    );
  }

  //  Multiple equal number of incidents across multiple categories: There have been ## crimes in this period. There were ## crimes each for crime types [Crimetype1], [crimetype2],...., [crimetype6].
  if (isEqual(mostFrequentIncidentCategories.categories, leastFrequentIncidentCategories.categories)) {
    return (
      <>
        There have been {totalIncidents} {incidentTypePlural} in this period. There{' '}
        {mostFrequentIncidentCategories.count != 1 ? 'were' : 'was'} {mostFrequentIncidentCategories.count}{' '}
        {mostFrequentIncidentCategories.count != 1 ? incidentTypePlural : incidentTypeSingular} each for crime types{' '}
        {mostFrequentIncidentCategories.categories.join(', ')}.
      </>
    );
  }

  return (
    <>
      There have been {totalIncidents} {incidentTypePlural} in this period.{' '}
      {mostFrequentIncidentCategories.categories.length > 1 ? (
        <>
          {mostFrequentIncidentCategories.categories.join(', ')}, were the most frequent, with{' '}
          {mostFrequentIncidentCategories.count}{' '}
          {mostFrequentIncidentCategories.count != 1 ? incidentTypePlural : incidentTypeSingular} each
        </>
      ) : (
        <>
          The most frequent {incidentTypeSingular} type was {mostFrequentIncidentCategories.categories[0]}, a total of{' '}
          {mostFrequentIncidentCategories.count}
        </>
      )}
      {leastFrequentIncidentCategories.categories.length > 1 ? '. ' : ', '}
      {leastFrequentIncidentCategories.categories.length > 1 ? (
        <>
          {leastFrequentIncidentCategories.categories.join(', ')}, were the least frequent, with{' '}
          {leastFrequentIncidentCategories.count}{' '}
          {leastFrequentIncidentCategories.count != 1 ? incidentTypePlural : incidentTypeSingular} each.
        </>
      ) : (
        <>
          and the least frequent {incidentTypeSingular} type was {leastFrequentIncidentCategories.categories[0]}, a
          total of {leastFrequentIncidentCategories.count}.
        </>
      )}
    </>
  );
}

export function formatBarChartIncidentsDataAsDynamicText<T extends IncidentReport>({
  data,
  filterKey,
  incidentTypeSingular,
  incidentTypePlural,
  dateString,
}: Params<T>) {
  const totalIncidents = data.length;

  const { mostFrequentIncidentCategories, leastFrequentIncidentCategories } = getIncidentsFrequencyByCategory(
    data,
    filterKey,
  );

  // Case 0 total incidents.
  if (totalIncidents === 0) {
    return (
      <>
        There were zero {incidentTypePlural} on {getFormattedPreviousDay(dateString)}.
      </>
    );
  }

  // Case 1 total incident
  if (totalIncidents === 1) {
    return (
      <>
        During this period, {totalIncidents} {incidentTypeSingular} occurred, in the{' '}
        {COPY_BY_TIME_OF_THE_DAY[mostFrequentIncidentCategories.categories[0]]}.
      </>
    );
  }

  //  Case If there were equal number of incidents across multiple categories
  if (isEqual(mostFrequentIncidentCategories.categories, leastFrequentIncidentCategories.categories)) {
    return (
      <>
        During this period, an equal number of {incidentTypePlural} occurred in the{' '}
        {mostFrequentIncidentCategories.categories.map((c) => COPY_BY_TIME_OF_THE_DAY[c]).join(', ')},{' '}
        {mostFrequentIncidentCategories.count}{' '}
        {mostFrequentIncidentCategories.count != 1 ? incidentTypePlural : incidentTypeSingular} each.
      </>
    );
  }

  return (
    <>
      During this period, most {incidentTypePlural} occurred in the{' '}
      {mostFrequentIncidentCategories.categories.length > 1 ? (
        <>
          {mostFrequentIncidentCategories.categories.map((c) => COPY_BY_TIME_OF_THE_DAY[c]).join(', ')}, with{' '}
          {mostFrequentIncidentCategories.count}{' '}
          {mostFrequentIncidentCategories.count != 1 ? incidentTypePlural : incidentTypeSingular} each
        </>
      ) : (
        <>
          {COPY_BY_TIME_OF_THE_DAY[mostFrequentIncidentCategories.categories[0]]}, a total of{' '}
          {mostFrequentIncidentCategories.count}
        </>
      )}
      {leastFrequentIncidentCategories.categories.length > 1 ? '. ' : ', '}
      {leastFrequentIncidentCategories.categories.length > 1 ? (
        <>
          Fewest {incidentTypePlural} occurred in the{' '}
          {leastFrequentIncidentCategories.categories.map((c) => COPY_BY_TIME_OF_THE_DAY[c]).join(', ')}, with{' '}
          {leastFrequentIncidentCategories.count}{' '}
          {leastFrequentIncidentCategories.count != 1 ? incidentTypePlural : incidentTypeSingular} each.
        </>
      ) : (
        <>
          and fewest {incidentTypePlural} occurred in the{' '}
          {COPY_BY_TIME_OF_THE_DAY[leastFrequentIncidentCategories.categories[0]]}, a total of{' '}
          {leastFrequentIncidentCategories.count}.
        </>
      )}
    </>
  );
}
