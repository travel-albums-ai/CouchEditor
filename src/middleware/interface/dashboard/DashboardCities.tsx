import SettingsSection from '@/components/SettingsSection';
import { useSections_GLOBAL_Forced } from '@/context/globals/sectionsStoreForced';
import { SectionType } from '@/hooks/sections/sectionTypes';
import DashboardCitiesItem from '@/middleware/interface/dashboard/DashboardCitiesItem';
import { Box } from '@mui/material';
import { Globe } from 'lucide-react';
import { useMemo } from 'react';

export default function DashboardCities() {
  const sectionsForced = useSections_GLOBAL_Forced();
  const sectionPhotos = sectionsForced.find(s => s.type === SectionType.Cities)?.data

  const groupByAvatar = useMemo(() => {
    const groups = new Map<string, typeof sectionPhotos>();

    for (const city of sectionPhotos ?? []) {
      const existing = groups.get(city.avatar);

      if (existing) {
        existing.push(city);
      } else {
        groups.set(city.avatar, [city]);
      }
    }

    return groups;
  }, [sectionPhotos]);

  const groups = useMemo(
    () =>
      Array.from(groupByAvatar.entries()).sort(
        (a, b) => b[1].length - a[1].length,
      ),
    [groupByAvatar],
  );

  return (
    <SettingsSection title="Cities" icon={<Globe />}>
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          columnWidth: 500,
          columnGap: 2,
        }}
      >
        {groups.map(([avatar, cities]) => (
          <Box
            id={`dashboard-cities-item-dense-${avatar}`}
            key={avatar}
            sx={{
              breakInside: 'avoid',
              WebkitColumnBreakInside: 'avoid',
              marginBottom: 2,
            }}
          >
            <DashboardCitiesItem
              avatar={avatar}
              cities={cities}
            />
          </Box>
        ))}
      </Box>
    </SettingsSection>
  );
}
