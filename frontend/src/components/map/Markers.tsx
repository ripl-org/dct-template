import { Typography, styled } from '@mui/material';
import { divIcon } from 'leaflet';
import { cloneElement, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker, Tooltip, useMapEvents } from 'react-leaflet';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

import { type IncidentReport, type TooltipElement } from '@/types';
import { sendEvent } from '@/lib/gtag';

function calculateIconSize(zoomLevel: number) {
  const baseSize = 40; // Initial size at zoom level 14
  const scaleFactor = 1.8; // Scale factor for exponential growth

  return baseSize * Math.pow(scaleFactor, zoomLevel - 14);
}

const StyledTooltip = styled(Tooltip)({});

function Markers(props: {
  data: IncidentReport[];
  iconsByCategory: Record<string, React.ReactElement>;
  tooltipElements: TooltipElement[];
  groupByField: string;
  individualCategory?: boolean;
  vizId: string;
  selectedDataPoint?: string;
  handleMarkerClick: (incidentNumber: string) => void;
}) {
  const [iconSize, setIconSize] = useState(24);
  const map = useMapEvents({
    zoom: () => {
      // Adjust Icon Size based on zoom level
      const currentZoom = map.getZoom();
      const newIconSize = calculateIconSize(currentZoom);
      setIconSize(newIconSize);
      // Track zoom event
      sendEvent('map_zoom_interaction', {
        target: props.vizId,
      });
    },
    click: () => {
      // Deselect active marker when clicking on the map
      props.handleMarkerClick('');
    },
  });

  return props.data.map((item, index) => {
    if (!item.Latitude || !item.Longitude || isNaN(item.Latitude) || isNaN(item.Longitude)) return null;

    const markerIcon = props.individualCategory
      ? props.iconsByCategory['Traffic']
      : props.iconsByCategory[item[props.groupByField as keyof IncidentReport]] ?? props.iconsByCategory['Other'];

    const markerIconWithDynamicStyle = cloneElement(markerIcon, {
      style: {
        ...markerIcon.props.style,
        outline: props.selectedDataPoint === item.id ? '-webkit-focus-ring-color auto 1px' : 'none',
      },
    });

    return (
      <div key={index}>
        <Marker
          position={[item.Latitude, item.Longitude]}
          icon={divIcon({
            className: 'marker',
            html: renderToString(markerIconWithDynamicStyle),
            iconSize: [iconSize, iconSize],
          })}
          riseOnHover
          zIndexOffset={props.selectedDataPoint === item.id ? 100 : 0}
          eventHandlers={{
            click: () => props.handleMarkerClick(item.id),
          }}
        >
          <StyledTooltip
            offset={[20, 0]}
            sx={{
              width: {
                xs: '180px !important',
                md: '300px !important',
              },
              whiteSpace: 'normal !important',
            }}
          >
            {props.tooltipElements.map((elem) => (
              <Typography
                sx={{
                  fontSize: { xs: '12px !important', md: '14px !important' },
                }}
                key={elem.objectKey}
              >
                <strong>{elem.text}:</strong>{' '}
                {elem.objectKey === 'TimeDateReported'
                  ? dayjs(new Date(item[elem.objectKey as keyof IncidentReport])).format('h:mm A')
                  : elem.objectKey === 'IncidentDate'
                    ? dayjs.utc(new Date(item[elem.objectKey as keyof IncidentReport])).format('MM/DD/YYYY')
                    : item[elem.objectKey as keyof IncidentReport]}
              </Typography>
            ))}
          </StyledTooltip>
        </Marker>
      </div>
    );
  });
}

export default Markers;
