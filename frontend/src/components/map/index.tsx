import { MapContainer, GeoJSON, type GeoJSONProps } from 'react-leaflet';
import { type Map as MapType, type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

import outline from '../../../public/data/outline.json';
import { MapLibreTileLayer } from '@/components/map/MapLibreTileLayer';
import Legend from '@/components/map/Legend';
import Markers from '@/components/map/Markers';
import { type IconsByCategory, type IncidentReport, type TooltipElement } from '@/types';
import getGeoJsonMaxBounds from '@/lib/getGeoJsonMaxBounds';
import { type RefObject } from 'react';

const INITIAL_LAT_LON: LatLngExpression = [41.568, -87.682];
const INITIAL_ZOOM_LEVEL = 13;

function Map(props: {
  data: IncidentReport[];
  legendTitle?: string;
  iconsByCategory: IconsByCategory;
  tooltipElements: TooltipElement[];
  groupByField: string;
  height?: number;
  individualCategory?: boolean;
  vizId: string;
  mapRef: RefObject<MapType>;
  selectedDataPoint?: string;
  handleMarkerClick: (incidentNumber: string) => void;
}) {
  return (
    <MapContainer
      style={{ height: props.height ?? 400 }}
      center={INITIAL_LAT_LON}
      zoom={INITIAL_ZOOM_LEVEL}
      scrollWheelZoom={false}
      attributionControl={false}
      zoomAnimation={false}
      maxBounds={getGeoJsonMaxBounds(outline as GeoJSONProps['data'])}
      ref={props.mapRef}
    >
      <Markers
        data={props.data}
        iconsByCategory={props.iconsByCategory}
        tooltipElements={props.tooltipElements}
        groupByField={props.groupByField}
        vizId={props.vizId}
        individualCategory={props.individualCategory}
        selectedDataPoint={props.selectedDataPoint}
        handleMarkerClick={props.handleMarkerClick}
      />

      <MapLibreTileLayer url={process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? ''} />

      {!props.individualCategory && <Legend iconsByCategory={props.iconsByCategory} legendTitle={props.legendTitle} />}

      <GeoJSON
        data={outline as GeoJSONProps['data']}
        style={{ color: '#000F0F', fillColor: 'transparent', weight: 1 }}
      />

      {/* Add a white layer to cover areas outside the GeoJSON boundary */}
      <GeoJSON
        data={
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-180, 90],
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                ],
                [...outline.features[0].geometry.coordinates[0]],
              ],
            },
          } as GeoJSONProps['data']
        }
        style={{ fillColor: 'grey', fillOpacity: 0.2, color: 'none' }}
      />
    </MapContainer>
  );
}

export default Map;
