import { Box, Divider, Stack, Typography } from '@mui/material';


import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import SettingsSection from '@/components/SettingsSection';
import countriesJSON from '@/data/countries.json';
import { GalleryPhoto } from '@/lib/galleryData';
import AlbumMapPanel from '@/pages/components/AlbumMapPanel';
import { Building2, ExternalLink, Map, Pin } from 'lucide-react';

export default function LocationSection({ photo }: { photo: GalleryPhoto }) {
  if (!photo) return null;

  return (
    <SettingsSection title="Location" icon={<Pin />} gap={0} divider={false} transparent={true}>
      <AlbumMapPanel photos={[photo]} />
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Stack divider={<Divider orientation="vertical" flexItem />} direction="row" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <div className={`fflag fflag-${photo.city.country}`} style={{ width: 16, height: 16, borderRadius: 10 }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1}}>
            <Building2 size={16} />
            <Typography color="textPrimary" variant="subtitle2">{photo.city.name}</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, opacity: 0.7 }}>
            <Map size={16} />
            <Typography color="textPrimary" variant="subtitle2">
              {countriesJSON.data.countries.find(country => country.country === photo.city.country)?.countryName}
            </Typography>
          </Box>
        </Stack>

        <GenericToggleButtonGroup
          variant="standard"
          items={[
            {
              tooltip: "Open in Google Maps",
              icon:  <ExternalLink />,
              onClick: () => window.open(`https://maps.google.com/?q=${photo.latitude},${photo.longitude}`, '_blank', 'noreferrer'),
              selected: false,
            },
          ] satisfies GenericToggleButtonProps[]}
        />
      </Box>
    </SettingsSection>
  );
}
