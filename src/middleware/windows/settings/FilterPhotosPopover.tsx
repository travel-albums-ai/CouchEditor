import PopoverButton from '@/components/PopoverButton';
import SettingsSection from '@/components/SettingsSection';
import { useFilterPhotos, useFilterStoreSelector } from '@/context/filterStore';
import { SectionType } from '@/hooks/sections/sectionTypes';
import FilterPresets from '@/middleware/windows/settings/components/FilterPresets';
import SettingComponentRow from '@/middleware/windows/settings/components/SettingComponentRow';
import SettingDateRow from '@/middleware/windows/settings/components/SettingDateRow';
import SettingsSliderRow from '@/middleware/windows/settings/components/SettingsSliderRow';
import SettingToggleRow from '@/middleware/windows/settings/components/SettingToggleRow';
import SettingTrileanRow from '@/middleware/windows/settings/components/SettingTrileanRow';
import CountriesFilter from '@/middleware/windows/settings/filters/CountriesFilter';
import DatesFilter from '@/middleware/windows/settings/filters/DatesFilter';
import FoldersFilter from '@/middleware/windows/settings/filters/FoldersFilter';
import GeneralRow from '@/middleware/windows/settings/filters/GeneralRow';
import PeopleAndPetsFilter from '@/middleware/windows/settings/filters/PeopleAndPetsFilter';
import { Box } from '@mui/material';
import { Calendar, Folder, Image, LocateFixed, LocateOff, MessageCircle, ThumbsUp, Users } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

export default function FilterPhotosPopover({ filter }: { filter?: string }) {
  const { setSetting } = useFilterPhotos()
  const settings = useFilterStoreSelector((state) => state)
  const { t } = useTranslation()
  const categories = [
    { key: 'date', label: t('filterCategoryDate'), icon: <Calendar size={ 16} /> },
    { key: 'people', label: t('filterCategoryPeople'), tile: true, icon: <Users size={ 16} /> },
    { key: 'locations', label: t('filterCategoryLocations'), tile: true, icon: <LocateFixed size={ 16} /> },
    { key: 'views', label: t('filterCategoryViews'), tile: true, icon: <Image size={ 16} /> },
    { key: 'likes', label: t('filterCategoryLikes'), tile: true, icon: <ThumbsUp size={ 16} /> },
    { key: 'comments', label: t('filterCategoryComments'), tile: true, icon: <MessageCircle size={ 16} /> },
    { key: 'folders', label: t('filterCategoryFolders'), icon: <Folder size={ 16} /> },
  ]

  const toggleControls = [
    { key: 'showWithWithoutPersons', label: t('filterNarrowByPersons'), value: 'show-without-persons', type: 'trilean', category: 'people', activeIcon: <Users size={16} />, inactiveIcon: <Image size={16} /> },
    { key: 'filterPeopleAndPets', label: t('filterByPeopleAndPets'), value: 'filter-people-and-pets', type: 'boolean', category: 'people' },
    { key: 'peopleAndPets2', label: t('filterIncludeExcludePeopleAndPets'), value: 'show-without-persons', type: 'component', category: 'people', component: <PopoverButton  triggerNaked={ false} width={450} trigger={<GeneralRow type={SectionType.PeopleAndPets} label={t('filterCategoryPeople')} />}><PeopleAndPetsFilter /></PopoverButton> },

    { key: 'showWithWithoutGps', label: t('filterShowGps'), value: 'show-without-gps', type: 'trilean', category: 'locations', activeIcon: <LocateFixed size={16} />, inactiveIcon: <LocateOff size={16} /> },
    { key: 'filterCountries', label: t('filterByCountries'), value: 'filter-countries', type: 'boolean', category: 'locations' },
    {
      key: 'countries2', label: t('filterIncludeExcludeCountries'), value: 'countries', type: 'component', category: 'locations', component: <PopoverButton width={550}  triggerNaked={ false} trigger={<GeneralRow type={SectionType.Countries} label={t('sectionCountries')} />}>
        <CountriesFilter />
      </PopoverButton>
    },

    { key: 'showViews', label: t('filterNarrowByViews'), value: 'show-views', type: 'boolean', category: 'views' },
    { key: 'showViewsMin', label: t('filterMinViews'), value: 'show-views-min', type: 'number', category: 'views', max: 100 },
    { key: 'showLikes', label: t('filterNarrowByLikes'), value: 'show-likes', type: 'boolean', category: 'likes' },
    { key: 'showLikesMin', label: t('filterMinLikes'), value: 'show-likes-min', type: 'number', category: 'likes', max: 50 },
    { key: 'showComments', label: t('filterNarrowByComments'), value: 'show-comments', type: 'boolean', category: 'comments' },
    { key: 'showCommentsMin', label: t('filterMinComments'), value: 'show-comments-min', type: 'number', category: 'comments', max: 25 },
    { key: 'filterDates', label: t('filterByDates'), value: 'filter-dates', type: 'boolean', category: 'date' },

    { key: 'filterFolders', label: t('filterByFolders'), value: 'filter-folders', type: 'boolean', category: 'folders' },
    { key: 'folders2', label: t('filterIncludeExcludeFolders'), value: 'folders', type: 'component', category: 'folders', component: <PopoverButton width={450} triggerNaked={ false} trigger={<GeneralRow type={SectionType.Folders} label={t('filterCategoryFolders')} />}><FoldersFilter /></PopoverButton> },

    { key: 'filterGps', label: t('filterNarrowByGps'), value: 'filter-gps', type: 'boolean', category: 'locations' },

    {
      key: 'dateFilter',
      label: t('filterNarrowByDateRanges'),
      value: 'date-range',
      type: 'component',
      category: 'date',
      component: <PopoverButton width={450} label={t('filterDatesLabel')} anchorHorizontal="center" anchorVertical="bottom" transformHorizontal="center" transformVertical="top">
        <DatesFilter />
      </PopoverButton>
    },
  ] as const


  const groupedControls = toggleControls.reduce((acc, control) => {
    if (!acc[control.category]) acc[control.category] = [];
    acc[control.category].push(control);
    return acc;
  }, {} as Record<string, typeof toggleControls>)


  return <>

    <SettingsSection>
      <FilterPresets />
    </SettingsSection>

    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: 1,
    }}>
      {Object.entries(groupedControls)
        .map(([category, controls], i) => (
          <Box key={category} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <SettingsSection icon={categories.find(c => c.key === category)?.icon} title={categories.find(c => c.key === category)?.label ?? category} uuid={`filter-photos-${category}`}>
              {controls
                .filter(control => !filter || control.label.toLowerCase().includes(filter.toLowerCase()))
                .map((control) => (
                  <Fragment key={control.key}>
                    {control.type === 'component' && control.component && <SettingComponentRow label={control.label} component={control.component} />}

                    {control.type === 'boolean' && <SettingToggleRow
                      label={control.label}
                      activeIcon={control.activeIcon}
                      inactiveIcon={control.inactiveIcon}
                      selected={settings[control.key]}
                      onChange={() => setSetting((prev) => ({ ...prev, [control.key]: !settings[control.key] }))}
                    />}

                    {control.type === 'trilean' && <SettingTrileanRow
                      label={control.label}
                      activeIcon={control.activeIcon}
                      inactiveIcon={control.inactiveIcon}
                      selected={settings[control.key]}
                      onChange={(value) => setSetting((prev) => ({ ...prev, [control.key]: value }))}
                    />}

                    {control.type === 'date' && <SettingDateRow
                      label={control.label}
                      activeIcon={control.activeIcon}
                      inactiveIcon={control.inactiveIcon}
                      value={settings[control.key]}
                      onChange={(value) => setSetting((prev) => ({ ...prev, [control.key]: value }))}
                    />}

                    {control.type === 'number' && <SettingsSliderRow
                      label={control.label}
                      max={control.max}
                      value={settings[control.key] || 0}
                      onChange={(value) => setSetting((prev) => ({ ...prev, [control.key]: value }))}
                      disabled={!settings[control.key.replace('Min', '') as keyof typeof settings]}
                    />}
                  </Fragment>
                ))}
            </SettingsSection>
          </Box>
        ))}
    </Box>
    {/* </Stack> */}
  </>
}
