import NoPhotos from '@/components/NoPhotos';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { Box, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ImageArray } from '../types';

type GpsPoint = {
  latitude: number;
  longitude: number;
  name: string;
};

function getCoordinate(exif: Record<string, unknown> | undefined, key: string): number | undefined {
  const value = exif?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function getGpsPoint(image: ImageArray[number]): GpsPoint | undefined {
  const latitude = getCoordinate(image.exif, 'latitude') ?? getCoordinate(image.exif, 'GPSLatitude');
  const longitude = getCoordinate(image.exif, 'longitude') ?? getCoordinate(image.exif, 'GPSLongitude');

  if (
    latitude === undefined ||
    longitude === undefined ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return undefined;
  }

  return { latitude, longitude, name: image.name };
}

function GpsMapNode({ data }: NodeProps<Node<{ image?: ImageArray }>>) {
  const { t } = useTranslation();
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const images = data.image ?? [];
  const points = images.flatMap((image) => {
    const point = getGpsPoint(image);
    return point ? [point] : [];
  });

  useEffect(() => {
    if (!mapElementRef.current) return;

    const map = L.map(mapElementRef.current, {
      attributionControl: true,
      zoomControl: true,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });

    if (points.length === 0) {
      map.setView([0, 0], 2);
      return;
    }

    const bounds = L.latLngBounds([]);
    points.forEach(({ latitude, longitude, name }) => {
      L.circleMarker([latitude, longitude], {
        radius: 7,
        color: '#ffffff',
        weight: 2,
        fillColor: '#d32f2f',
        fillOpacity: 0.9,
      })
        .bindTooltip(name)
        .addTo(map);
      bounds.extend([latitude, longitude]);
    });

    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
    map.invalidateSize();
  }, [points]);

  return (
    <>
      <InputHandle id="image" position={Position.Top} />
      <NodeWrapper type="gps-map">
        <Typography variant="body2" color="text.secondary" sx={{ pb: 1 }}>
          {t('pipelineGpsMarkers', { count: points.length })}
        </Typography>
        <Box className="nowheel" sx={{ width: '500px', height: '500px', position: 'relative' }}>
          <Box ref={mapElementRef} sx={{ width: '100%', height: '100%' }} />
          {points.length === 0 && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
              }}
            >
              {images.length === 0 ? (
                <NoPhotos />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('pipelineNoGpsData')}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </NodeWrapper>
    </>
  );
}

export default GpsMapNode;
