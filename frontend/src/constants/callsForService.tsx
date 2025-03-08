import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'; // Alarm
import LocalPoliceRoundedIcon from '@mui/icons-material/LocalPoliceRounded'; // Assist
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'; // Crime
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'; // Disorder
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'; // Civil
import TimeToLeaveRoundedIcon from '@mui/icons-material/TimeToLeaveRounded'; // Traffic
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded'; // Other
import { type IconsByCategory, type TooltipElement } from '@/types';

export const COLORS_BY_CATEGORY: Record<string, string> = {
  Alarm: '#FAC228',
  Assist: '#F57D15',
  Crime: '#D44842',
  Disorder: '#9F2A63',
  Civil: '#65156E',
  Traffic: '#280B53',
  Other: '#000004',
};

export const ICONS_BY_CATEGORY: IconsByCategory = {
  Alarm: <NotificationsRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Alarm'] }} />,
  Assist: <LocalPoliceRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Assist'] }} />,
  Crime: <WarningRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Crime'] }} />,
  Disorder: <CampaignRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Disorder'] }} />,
  Civil: <PeopleAltRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Civil'] }} />,
  Traffic: <TimeToLeaveRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Traffic'] }} />,
  Other: <NewReleasesRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Other'] }} />,
};

export const TOOLTIP_ELEMENTS: TooltipElement[] = [
  {
    text: 'Call Time',
    objectKey: 'TimeDateReported',
  },
  {
    text: 'Type',
    objectKey: 'CallType',
  },
  {
    text: 'Nature of Call',
    objectKey: 'CallNature',
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
