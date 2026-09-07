import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import SettingsSection from '@/components/SettingsSection';
import { useSections_GLOBAL_Forced } from '@/context/globals/sectionsStoreForced';
import { SectionType } from '@/hooks/sections/sectionTypes';
import { Box, Typography } from '@mui/material';
import { PersonStanding } from 'lucide-react';

export default function DashboardFriends() {
  const sectionsForced = useSections_GLOBAL_Forced();
  const sectionPhotos = sectionsForced.find(s => s.type === SectionType.PeopleAndPets)?.data

  return (
    <SettingsSection title="Friends" icon={<PersonStanding />} guidance={`${sectionPhotos?.length || 0} friends`} >
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: 2, flexWrap: 'wrap', height: '100%' }}>
        {sectionPhotos?.map((item) => (
          <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ width: '100px', height: '100px', borderRadius: 50, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <AlbumPhotoThumbnailBackgroundNg photo={item.photos?.[0]} width={100} height={100} />
            </Box>
            <Typography variant="caption" color="textDisabled">{item.name}</Typography>
          </Box>
        ))}
      </Box>
    </SettingsSection>
  );
}
