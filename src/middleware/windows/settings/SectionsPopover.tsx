import GeneralRegistryToolRenderer from '@/components/registry/GeneralRegistryToolRenderer';
import SettingsSection from '@/components/SettingsSection';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { SectionType } from '@/hooks/sections/sectionTypes';
import { sectionIcons } from '@/icons/IconsIndex';
import SettingsComponentRow from '@/middleware/windows/settings/components/SettingsComponentRow';
import SettingToggleRow from '@/middleware/windows/settings/components/SettingToggleRow';
import { Ban, Check, Settings } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: SectionType.PeopleAndPets, icon: sectionIcons[SectionType.PeopleAndPets], labelKey: 'sectionPeopleAndPets', value: 'show-people-and-pets', type: 'boolean' },
  { key: SectionType.Countries, icon: sectionIcons[SectionType.Countries], labelKey: 'sectionCountries', value: 'show-countries', type: 'boolean' },
  { key: SectionType.NowAndThen, icon: sectionIcons[SectionType.NowAndThen], labelKey: 'sectionNowAndThen', value: 'show-now-and-then', type: 'boolean' },
  { key: SectionType.Views, icon: sectionIcons[SectionType.Views], labelKey: 'sectionViews', value: 'show-views', type: 'boolean' },
  { key: SectionType.Likes, icon: sectionIcons[SectionType.Likes], labelKey: 'sectionLikes', value: 'show-likes', type: 'boolean' },
  { key: SectionType.Comments, icon: sectionIcons[SectionType.Comments], labelKey: 'sectionComments', value: 'show-comments', type: 'boolean' },
  { key: SectionType.Favorites, icon: sectionIcons[SectionType.Favorites], labelKey: 'sectionFavorites', value: 'show-favorites', type: 'boolean' },
  { key: SectionType.Timeline, icon: sectionIcons[SectionType.Timeline], labelKey: 'sectionTimeline', value: 'show-timeline', type: 'boolean' },
  { key: SectionType.Ignored, icon: sectionIcons[SectionType.Ignored], labelKey: 'sectionIgnored', value: 'show-ignored', type: 'boolean', disabled: true },
  { key: SectionType.Private, icon: sectionIcons[SectionType.Private], labelKey: 'sectionPrivate', value: 'show-private', type: 'boolean', disabled: true },
  { key: SectionType.Selected, icon: sectionIcons[SectionType.Selected], labelKey: 'sectionSelected', value: 'show-selected', type: 'boolean', disabled: true },
  { key: SectionType.Tags, icon: sectionIcons[SectionType.Tags], labelKey: 'sectionTags', value: 'show-tags', type: 'boolean'},
  { key: SectionType.Labels, icon: sectionIcons[SectionType.Labels], labelKey: 'sectionLabels', value: 'show-labels', type: 'boolean' },
  { key: SectionType.Cities, icon: sectionIcons[SectionType.Cities], labelKey: 'sectionCities', value: 'show-cities', type: 'boolean' },
] as const

const explorerTools = [
  { key: 'sortSectionsToggle', labelKey: "sortSectionsToggle", type: 'toolbar', toolbarComponentId: "sortSectionsToggle" },
]

export default function SectionsPopover({ filter }: { filter?: string }) {
  const { setModule } = useSettings()
  const modules = useSettingsStoreSelector((state) => state.modules)
  const { t } = useTranslation()

  return <>
    <SettingsSection title="Features" icon={<Settings size={16} />}>
      {explorerTools
        .filter(control => !filter || t(control.labelKey).toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => t(a.labelKey).localeCompare(t(b.labelKey)))
        .sort((a, b) => (a.disabled !== b.disabled ? (a.disabled ? 1 : -1) : 0))
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'boolean' && <SettingToggleRow
              label={t(control.labelKey)}
              icon={control.icon}
              disabled={control.disabled ?? false}
              inactiveIcon={control.disabled ? undefined : <Check size={16} />}
              activeIcon={control.disabled ? undefined : <Ban size={16} />}
              selected={modules[control.key]}
              onChange={() => setModule(control.key, !modules[control.key])}
            />}

            {control.type === 'toolbar' && <SettingsComponentRow label={t(control.labelKey)}>
              <GeneralRegistryToolRenderer toolId={control.toolbarComponentId} />
            </SettingsComponentRow>}
          </Fragment>
        ))}
    </SettingsSection>

    <SettingsSection title="Active sections" icon={<Check size={16} />}>
      {toggleControls
        .filter(control => !filter || t(control.labelKey).toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => t(a.labelKey).localeCompare(t(b.labelKey)))
        .sort((a, b) => (a.disabled !== b.disabled ? (a.disabled ? 1 : -1) : 0))
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'boolean' && <SettingToggleRow
              label={t(control.labelKey)}
              icon={control.icon}
              disabled={control.disabled ?? false}
              inactiveIcon={control.disabled ? undefined : <Check size={16} />}
              activeIcon={control.disabled ? undefined : <Ban size={16} />}
              selected={modules[control.key]}
              onChange={() => setModule(control.key, !modules[control.key])}
            />}
          </Fragment>
        ))}
    </SettingsSection>
  </>
}
