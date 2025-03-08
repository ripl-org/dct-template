import {
  type LayerProps,
  createElementObject,
  createTileLayerComponent,
  updateGridLayer,
  withPane,
} from '@react-leaflet/core';
import L from 'leaflet';
import '@maplibre/maplibre-gl-leaflet';

export interface MapLibreTileLayerProps extends L.LeafletMaplibreGLOptions, LayerProps {
  url: string;
}

export const MapLibreTileLayer = createTileLayerComponent<L.MaplibreGL, MapLibreTileLayerProps>(
  function createTileLayer({ url, ...options }, context) {
    // @ts-expect-error Ignoring type errors until they get fixed: https://github.com/maplibre/maplibre-gl-leaflet/issues/40
    const layer = L.maplibreGL({ style: url, noWrap: true }, withPane(options, context));
    return createElementObject(layer, context);
  },
  function updateTileLayer(layer, props, prevProps) {
    // @ts-expect-error Ignoring type errors until they get fixed: https://github.com/maplibre/maplibre-gl-leaflet/issues/40
    updateGridLayer(layer, props, prevProps);

    const { url } = props;
    if (url != null && url !== prevProps.url) {
      // @ts-expect-error Ignoring type errors until they get fixed: https://github.com/maplibre/maplibre-gl-leaflet/issues/40
      layer.getMaplibreMap().setStyle(url);
    }
  },
);
