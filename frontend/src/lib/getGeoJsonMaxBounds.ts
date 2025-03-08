// @ts-expect-error library exporting the wrong types
import calculateBbox from '@turf/bbox';
import { type LatLngBoundsExpression } from 'leaflet';
import { type GeoJSONProps } from 'react-leaflet';

// Add an offset to the bounding box
const OFFSET = 0.2; // adjust this value as needed

function getGeoJsonMaxBounds(geoJsonData: GeoJSONProps['data']): LatLngBoundsExpression {
  const [minX, minY, maxX, maxY] = calculateBbox(geoJsonData);

  // Calculate offset values
  const offsetX = (maxX - minX) * OFFSET;
  const offsetY = (maxY - minY) * OFFSET;

  // Adjust the bounding box with the offset
  const maxBounds: LatLngBoundsExpression = [
    [minY - offsetY, minX - offsetX], // Southwest coordinates
    [maxY + offsetY, maxX + offsetX], // Northeast coordinates
  ];

  return maxBounds;
}

export default getGeoJsonMaxBounds;
