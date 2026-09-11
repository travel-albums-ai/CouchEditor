import GeneralRegistryToolRenderer from '@/components/registry/GeneralRegistryToolRenderer';
import SettingsSection from '@/components/SettingsSection';
import { useAlbumPhotoCard, useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingFieldRow from '@/middleware/windows/settings/components/SettingFieldRow';
import SettingsComponentRow from '@/middleware/windows/settings/components/SettingsComponentRow';
import SettingToggleRow from '@/middleware/windows/settings/components/SettingToggleRow';
import { Cpu, Languages, PaintBucket } from 'lucide-react';
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
  const { setSetting } = useSettings()
  const pipelineMaxConcurrentTasks = useSettingsStoreSelector((state) => state.pipelineMaxConcurrentTasks)
  const pipelinePhotoBatchSize = useSettingsStoreSelector((state) => state.pipelinePhotoBatchSize)

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

    <SettingsSection title={t('pipelineSettingsSection')} icon={<Cpu />}>
      <SettingFieldRow
        label={t('pipelineMaxConcurrentTasks')}
        value={String(pipelineMaxConcurrentTasks)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelineMaxConcurrentTasks: Math.max(1, Math.min(32, parsed)),
          }))
        }}
      />
      <SettingFieldRow
        label={t('pipelinePhotoBatchSize')}
        value={String(pipelinePhotoBatchSize)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelinePhotoBatchSize: Math.max(1, Math.min(100, parsed)),
          }))
        }}
      />
    </SettingsSection>


  </>
}
