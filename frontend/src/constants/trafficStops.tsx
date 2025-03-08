import TimeToLeaveRoundedIcon from '@mui/icons-material/TimeToLeaveRounded'; // Traffic
import { type IconsByCategory, type TooltipElement } from '@/types';

export const COLORS_BY_CATEGORY: Record<string, string> = {
  Traffic: '#280B53',
};

export const ICONS_BY_CATEGORY: IconsByCategory = {
  Traffic: <TimeToLeaveRoundedIcon fontSize="inherit" style={{ fill: COLORS_BY_CATEGORY['Traffic'] }} />,
};

export const TOOLTIP_ELEMENTS: TooltipElement[] = [
  {
    text: 'Incident Time',
    objectKey: 'TimeDateReported',
  },
  {
    text: 'Approximate Location',
    objectKey: 'Location',
  },
];
