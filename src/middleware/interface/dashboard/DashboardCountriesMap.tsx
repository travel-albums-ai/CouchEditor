import SettingsSection from '@/components/SettingsSection';
import { useSections_GLOBAL_Forced } from '@/context/globals/sectionsStoreForced';
import { SectionType } from '@/hooks/sections/sectionTypes';
import { Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Globe } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

export default function DashboardCountriesMap() {
  const sectionsForced = useSections_GLOBAL_Forced();
  const sectionPhotos = sectionsForced.find(s => s.type === SectionType.Countries)?.data

  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const countries = useMemo(() => {
    return (sectionPhotos ?? []).filter((country) => {
      const photo = country.photos?.[0];

      return (
        photo &&
        Number.isFinite(photo.latitude) &&
        Number.isFinite(photo.longitude)
      );
    });
  }, [sectionPhotos]);

  useEffect(() => {
    if (!mapElementRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapElementRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 2,
        worldCopyJump: true,
      });

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
        },
      ).addTo(map);

      mapRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    const map = mapRef.current;

    for (const marker of markersRef.current) {
      marker.remove();
    }

    markersRef.current = [];

    for (const country of countries) {
      const photo = country.photos[0];

      const icon = L.divIcon({
        className: '',
        html: `
          <div
            style="
              width: 42px;
              height: 42px;
              border-radius: 50%;
              overflow: hidden;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,.45);
              background: #222;
            "
          >
            <div
              class="fflag fflag-${country.avatar}"
              style="
                width: 100%;
                height: 100%;
                border-radius: 50%;
              "
            ></div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      const marker = L.marker(
        [photo.latitude, photo.longitude],
        { icon },
      )
        .addTo(map)
        .bindTooltip(country.name, {
          direction: 'top',
          offset: [0, -21],
        })
        .bindPopup(`
          <strong>${country.name}</strong>
          <br />
          ${country.photos.length} photos
        `);

      markersRef.current.push(marker);
    }
  }, [countries]);

  useEffect(() => {
    return () => {
      for (const marker of markersRef.current) {
        marker.remove();
      }

      markersRef.current = [];

      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <SettingsSection
      title="Globe"
      icon={<Globe />}
    >
      <Box
        sx={{
          width: '100%',
          height: 600,
          minHeight: 600,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          ref={mapElementRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    </SettingsSection>
  );
}
