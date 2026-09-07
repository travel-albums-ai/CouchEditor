import SettingsSection from '@/components/SettingsSection';
import SolidChip from '@/components/SolidChip';
import { useSections_GLOBAL_Forced } from '@/context/globals/sectionsStoreForced';
import { SectionType } from '@/hooks/sections/sectionTypes';
import DashboardPreviewImages from '@/middleware/interface/dashboard/DashboardPreviewImages';
import { Box, Typography } from '@mui/material';
import { Globe } from 'lucide-react';

const size = 60;

export default function DashboardCountries() {
  const sectionsForced = useSections_GLOBAL_Forced();
  const sectionPhotos = sectionsForced.find(s => s.type === SectionType.Countries)?.data

  return (
    <SettingsSection title="Countries" icon={<Globe />} guidance={`Total: ${sectionPhotos?.length ?? 0}`} gap={1} divider={false}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        overflow: 'auto',
        boxShadow: 2,
        bgcolor: 'background.default',
        borderRadius: 2,
        p: 2, pr: 8,
        gap: 12, flexWrap: 'nowrap' }}>
        {sectionPhotos?.sort((a, b) => b.photos.length - a.photos.length)
          .filter((item, i) => i < 10)
          .map((item, i) => (
            <Box key={item.name} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start', gap: 1 }}>
              <Typography variant="caption" color="textDisabled" gutterBottom={false} sx={{
                fontSize: 80,
                lineHeight: 1,
                // position: 'absolute',
                // bottom: -30,
                // left: 0,
              }}>{i + 1}</Typography>
              <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 1, position: 'relative', ml: -2 }}>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1, zIndex: 1 }}>
                  <div className={`fflag fflag-${item.avatar}`} style={{ width: 16, height: 16, borderRadius: 10 }} />
                  <Typography variant="caption" color="textDisabled">{item.name}</Typography>
                  <SolidChip count={item.photos.length} />
                </Box>

                <DashboardPreviewImages photos={item.photos} count={4} size={120} sx={{  zIndex: 1 }} eager />
              </Box>
            </Box>
          ))}
      </Box>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 2, py: 2, flexWrap: 'wrap', height: '100%' }}>
        {sectionPhotos?.sort((a, b) => b.photos.length - a.photos.length)
          .filter((item, i) => i > 10)
          .sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
            <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <div className={`fflag fflag-${item.avatar}`} style={{ width: 16, height: 16, borderRadius: 10 }} />
                <Typography variant="caption" color="textDisabled">{item.name}</Typography>
                <SolidChip count={item.photos.length} />
              </Box>

              {/* <DashboardPreviewImages photos={item.photos} /> */}
            </Box>
          ))}
      </Box>
    </SettingsSection>
  );
}
