import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'; // Disorderly Conduct
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'; // Financial Crimes
import PanToolRoundedIcon from '@mui/icons-material/PanToolRounded'; // Physical or Sexual Violence
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'; // Property and Theft-Related Crimes
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded'; // Substance-Related Crimes
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded'; // Other Crimes
import { type IconsByCategory, type TooltipElement } from '@/types';

export const COLORS_BY_CATEGORY: Record<string, string> = {
  'Disorderly Conduct': '#FAC228',
  'Financial Crimes': '#F57D15',
  'Physical or Sexual Violence': '#9F2A63',
  'Property and Theft-Related Crimes': '#D44842',
  'Substance-Related Crimes': '#65156E',
  'Other Crimes': '#000004',
};

export const ICONS_BY_CATEGORY: IconsByCategory = {
  'Disorderly Conduct': (
    <CampaignRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Disorderly Conduct'] }} />
  ),
  'Financial Crimes': (
    <MonetizationOnRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Financial Crimes'] }} />
  ),
  'Physical or Sexual Violence': (
    <PanToolRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Physical or Sexual Violence'] }} />
  ),
  'Property and Theft-Related Crimes': (
    <HomeRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Property and Theft-Related Crimes'] }} />
  ),
  'Substance-Related Crimes': (
    <MedicationRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Substance-Related Crimes'] }} />
  ),
  'Other Crimes': <NewReleasesRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Other'] }} />,
};

export const TOOLTIP_ELEMENTS: TooltipElement[] = [
  {
    text: 'Incident Time',
    objectKey: 'TimeDateReported',
  },
  {
    text: 'Crime Type',
    objectKey: 'CrimeCategory',
  },
  {
    text: 'Outcome',
    objectKey: 'IncidentDisposition',
  },
  {
    text: 'Approximate Location',
    objectKey: 'Location',
  },
];

export const FILTER_BY_CATEGORY_INITIAL_STATE: { [key: string]: boolean } = Object.keys(COLORS_BY_CATEGORY).reduce<{
  [key: string]: boolean;
}>((acc, category) => {
  acc[category] = false;
  return acc;
}, {});
