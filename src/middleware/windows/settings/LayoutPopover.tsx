import GeneralRegistryToolRenderer from '@/components/registry/GeneralRegistryToolRenderer';
import SettingsSection from '@/components/SettingsSection';
import { useAlbumPhotoCard, useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import SettingsComponentRow from '@/middleware/windows/settings/components/SettingsComponentRow';
import SettingToggleRow from '@/middleware/windows/settings/components/SettingToggleRow';
import { Languages, PaintBucket } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const groups = [
  {
    titleKey: 'layoutLocale',
    controls: [
      { key: 'locale', labelKey: 'layoutLocale', type: 'toolbar', toolbarComponentId: "localeToggle" },
    ],
    icon: <Languages />,
  },
  {
    titleKey: 'layoutThemeSection',
    controls: [
      { key: 'theme', labelKey: 'layoutTheme', type: 'toolbar', toolbarComponentId: "themeMenu" },
      { key: 'darkLightStatus', labelKey: 'toggleThemeName', type: 'toolbar', toolbarComponentId: "darkLightStatus" },
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

              {control.type === 'toolbar' && <SettingsComponentRow label={t(control.labelKey)}>
                <GeneralRegistryToolRenderer toolId={control.toolbarComponentId} />
              </SettingsComponentRow>}
            </Fragment>
          ))}
      </SettingsSection>
    ))}


  </>
}
