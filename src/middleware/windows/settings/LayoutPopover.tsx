import SettingsSection from '@/components/SettingsSection';
import { useAlbumPhotoCard, useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import DarkLightStatus from '@/middleware/tools/DarkLightStatus';
import LocaleToggle from '@/middleware/tools/LocaleToggle';
import ThemeMenu from '@/middleware/tools/ThemeMenu';
import SettingsComponentRow from '@/middleware/windows/settings/components/SettingsComponentRow';
import SettingToggleRow from '@/middleware/windows/settings/components/SettingToggleRow';
import { Languages, PaintBucket } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const groups = [
  {
    titleKey: 'layoutLocale',
    controls: [
      { key: 'locale', labelKey: 'layoutLocale', type: 'component', toolbarComponentId: <LocaleToggle /> },
    ],
    icon: <Languages />,
  },
  {
    titleKey: 'layoutThemeSection',
    controls: [
      { key: 'theme', labelKey: 'layoutTheme', type: 'component', toolbarComponentId: <ThemeMenu /> },
      { key: 'darkLightStatusAA', labelKey: 'toggleThemeName', type: 'component', toolbarComponentId: <DarkLightStatus /> },
    ],
    icon: <PaintBucket />,
  },
]

export default function LayoutPopover() {
  const { setSetting: setCardSetting } = useAlbumPhotoCard()
  const cardSettings = useAlbumPhotoCardStoreSelector((state) => state)
  const { t } = useTranslation()

  return <>
    {groups.map((group) => (
      <SettingsSection key={group.titleKey} title={t(group.titleKey)} icon={group.icon} >
        {group.controls
          .map((control) => (
            <Fragment key={control.key}>
              {control.type === 'boolean' && <SettingToggleRow
                key={control.key}
                label={t(control.labelKey)}
                selected={cardSettings[control.key]}
                onChange={() => setCardSetting((prev) => ({ ...prev, [control.key]: !cardSettings[control.key] }))}
              />}

              {control.type === 'component' && <SettingsComponentRow label={t(control.labelKey)}>
                {control.toolbarComponentId}
              </SettingsComponentRow>}
            </Fragment>
          ))}
      </SettingsSection>
    ))}
  </>
}
