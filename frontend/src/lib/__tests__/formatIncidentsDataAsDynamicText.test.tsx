import { type Crime } from '@/hooks/useCrime24HR';
import {
  formatMapIncidentsDataAsDynamicText,
  formatBarChartIncidentsDataAsDynamicText,
  type Params,
} from '@/lib/formatIncidentsDataAsDynamicText';
import { render } from '@testing-library/react';

const MAP_DEFAULT_PARAMS: Params<Crime> = {
  data: [],
  filterKey: 'CrimeCategory',
  incidentTypePlural: 'crimes',
  incidentTypeSingular: 'crime',
  dateString: '2024-03-14 01:10:15',
};

const BAR_CHART_DEFAULT_PARAMS: Params<Crime> = {
  data: [],
  filterKey: 'TimeDateReported',
  incidentTypePlural: 'crimes',
  incidentTypeSingular: 'crime',
  dateString: '2024-03-14 01:10:15',
};

const MAP_MOCK_DATA = {
  singleIncident: [{ CrimeCategory: 'Physical or Sexual Violence' }],
  multipleIncidentsWithUniqueCategory: [{ CrimeCategory: 'Traffic' }, { CrimeCategory: 'Traffic' }],
  multipleEqualIncidentsAcrossMultipleCateogories: [
    { CrimeCategory: 'Financial Crimes' },
    { CrimeCategory: 'Financial Crimes' },
    { CrimeCategory: 'Financial Crimes' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Physical or Sexual Violence' },
  ],
  singleEqualIncidentsAcrossMultipleCateogories: [{ CrimeCategory: 'Traffic' }, { CrimeCategory: 'Other Crimes' }],
  multipleMostAndLessFrequentIncidentsCategories: [
    { CrimeCategory: 'Financial Crimes' },
    { CrimeCategory: 'Financial Crimes' },
    { CrimeCategory: 'Financial Crimes' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Disorderly Conduct' },
    { CrimeCategory: 'Disorderly Conduct' },
  ],
  mostAndLessCase1: [
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Disorderly Conduct' },
    { CrimeCategory: 'Disorderly Conduct' },
  ],
  mostAndLessCase2: [
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Disorderly Conduct' },
  ],
  mostAndLessCase3: [
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Disorderly Conduct' },
    { CrimeCategory: 'Disorderly Conduct' },
    { CrimeCategory: 'Disorderly Conduct' },
  ],
  MostAndLessCase4: [
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Traffic' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Physical or Sexual Violence' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Other Crimes' },
    { CrimeCategory: 'Disorderly Conduct' },
    { CrimeCategory: 'Disorderly Conduct' },
    { CrimeCategory: 'Disorderly Conduct' },
  ],
};

const BARCHART_MOCK_DATA = {
  singleIncident: [{ TimeDateReported: '2024-02-27 11:20:46' }],
  singleEqualNumberOfIncidentAcrossMultipleTimeRanges: [
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 17:44:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
  ],
  multipleEqualNumberOfIncidentAcrossMultipleTimeRanges: [
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 17:44:46' },
    { TimeDateReported: '2024-02-27 17:44:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
  ],
  mostAndLessCase1: [
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 08:25:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
  ],
  mostAndLessCase2: [
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
  ],
  mostAndLessCase3: [
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
  ],
  mostAndLessCase4: [
    { TimeDateReported: '2024-02-27 02:25:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 11:20:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
    { TimeDateReported: '2024-02-27 23:25:46' },
  ],
};

describe('formatMapIncidentsDataAsDynamicText()', () => {
  describe('Case: Zero incidents', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(formatMapIncidentsDataAsDynamicText<Crime>(MAP_DEFAULT_PARAMS));
      expect(container).toHaveTextContent('There were zero crimes on Mar 13, 2024.');
    });
  });

  describe('Case: Single incident', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatMapIncidentsDataAsDynamicText<Crime>({
          ...MAP_DEFAULT_PARAMS,
          data: MAP_MOCK_DATA.singleIncident as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'There has been 1 crime in this period, the crime type was Physical or Sexual Violence.',
      );
    });
  });

  describe('Case: Multiple incidents with unique category', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatMapIncidentsDataAsDynamicText<Crime>({
          ...MAP_DEFAULT_PARAMS,
          data: MAP_MOCK_DATA.multipleIncidentsWithUniqueCategory as Crime[],
        }),
      );

      expect(container).toHaveTextContent('There have been 2 crimes in this period, the crime type was Traffic.');
    });
  });

  describe('Case: Multiple equal number of incidents across multiple categories', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatMapIncidentsDataAsDynamicText<Crime>({
          ...MAP_DEFAULT_PARAMS,
          data: MAP_MOCK_DATA.multipleEqualIncidentsAcrossMultipleCateogories as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'There have been 9 crimes in this period. There were 3 crimes each for crime types Financial Crimes, Traffic, Physical or Sexual Violence.',
      );
    });
  });

  describe('Case: Single equal number of incidents across multiple categories', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatMapIncidentsDataAsDynamicText<Crime>({
          ...MAP_DEFAULT_PARAMS,
          data: MAP_MOCK_DATA.singleEqualIncidentsAcrossMultipleCateogories as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'There have been 2 crimes in this period. There was 1 crime each for crime types Traffic, Other Crimes.',
      );
    });
  });

  describe('Case: Multiple most and less frequent incidents categories (tie)', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatMapIncidentsDataAsDynamicText<Crime>({
          ...MAP_DEFAULT_PARAMS,
          data: MAP_MOCK_DATA.multipleMostAndLessFrequentIncidentsCategories as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'There have been 12 crimes in this period. Financial Crimes, Traffic, were the most frequent, with 3 crimes each. Physical or Sexual Violence, Other Crimes, Disorderly Conduct, were the least frequent, with 2 crimes each.',
      );
    });
  });

  describe('Case: [Most frequent] Single category with multiple incidents | [Less frequent] Multiple categories with multiple incidents each', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatMapIncidentsDataAsDynamicText<Crime>({
          ...MAP_DEFAULT_PARAMS,
          data: MAP_MOCK_DATA.mostAndLessCase1 as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'There have been 11 crimes in this period. The most frequent crime type was Traffic, a total of 5. Physical or Sexual Violence, Other Crimes, Disorderly Conduct, were the least frequent, with 2 crimes each.',
      );
    });
  });

  describe('Case: [Most frequent] Single category with multiple incidents | [Less frequent] Multiple categories with 1 incident each', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatMapIncidentsDataAsDynamicText<Crime>({
          ...MAP_DEFAULT_PARAMS,
          data: MAP_MOCK_DATA.mostAndLessCase2 as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'There have been 8 crimes in this period. The most frequent crime type was Traffic, a total of 5. Physical or Sexual Violence, Other Crimes, Disorderly Conduct, were the least frequent, with 1 crime each.',
      );
    });
  });

  describe('Case: [Most frequent] Multiple categories with multiple incidents | [Less frequent] Multiple categories with 1 incident each', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatMapIncidentsDataAsDynamicText<Crime>({
          ...MAP_DEFAULT_PARAMS,
          data: MAP_MOCK_DATA.mostAndLessCase3 as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'There have been 10 crimes in this period. Physical or Sexual Violence, Other Crimes, Disorderly Conduct, were the most frequent, with 3 crimes each, and the least frequent crime type was Traffic, a total of 1.',
      );
    });
  });

  describe('Case: [Most frequent] Multiple categories with multiple incidents | [Less frequent] Multiple categories with multiple incidents each', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatMapIncidentsDataAsDynamicText<Crime>({
          ...MAP_DEFAULT_PARAMS,
          data: MAP_MOCK_DATA.MostAndLessCase4 as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'There have been 11 crimes in this period. Physical or Sexual Violence, Other Crimes, Disorderly Conduct, were the most frequent, with 3 crimes each, and the least frequent crime type was Traffic, a total of 2.',
      );
    });
  });
});

describe('formatBarChartIncidentsDataAsDynamicText()', () => {
  describe('Case: Zero incidents', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(formatBarChartIncidentsDataAsDynamicText<Crime>(BAR_CHART_DEFAULT_PARAMS));
      expect(container).toHaveTextContent('There were zero crimes on Mar 13, 2024.');
    });
  });

  describe('Case: Single incident', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatBarChartIncidentsDataAsDynamicText<Crime>({
          ...BAR_CHART_DEFAULT_PARAMS,
          data: BARCHART_MOCK_DATA.singleIncident as Crime[],
        }),
      );

      expect(container).toHaveTextContent('During this period, 1 crime occurred, in the Morning (6am–12pm).');
    });
  });

  describe('Case: Single equal number of incidents across multiple time ranges', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatBarChartIncidentsDataAsDynamicText<Crime>({
          ...BAR_CHART_DEFAULT_PARAMS,
          data: BARCHART_MOCK_DATA.singleEqualNumberOfIncidentAcrossMultipleTimeRanges as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'During this period, an equal number of crimes occurred in the Morning (6am–12pm), Afternoon (12pm–6pm), Evening (6pm–12am), Late Night (12am–6am), 1 crime each.',
      );
    });
  });

  describe('Case: Multiple equal number of incidents across multiple time ranges', () => {
    it('Returns correct formatted text', () => {
      const { container } = render(
        formatBarChartIncidentsDataAsDynamicText<Crime>({
          ...BAR_CHART_DEFAULT_PARAMS,
          data: BARCHART_MOCK_DATA.multipleEqualNumberOfIncidentAcrossMultipleTimeRanges as Crime[],
        }),
      );

      expect(container).toHaveTextContent(
        'During this period, an equal number of crimes occurred in the Morning (6am–12pm), Afternoon (12pm–6pm), Evening (6pm–12am), Late Night (12am–6am), 2 crimes each.',
      );
    });
  });
});
