import SettingsSection from '@/components/SettingsSection';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingFieldRow from '@/windows/settings/components/SettingFieldRow';
import SettingToggleRow from '@/windows/settings/components/SettingToggleRow';
import { Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PerformanceSettings() {
  const { t } = useTranslation()
  const { setSetting } = useSettings()
  const pipelineMaxConcurrentTasks = useSettingsStoreSelector((state) => state.pipelineMaxConcurrentTasks)
  const pipelinePhotoBatchSize = useSettingsStoreSelector((state) => state.pipelinePhotoBatchSize)
  const pipelineMaxAIRequests = useSettingsStoreSelector((state) => state.pipelineMaxAIRequests)
  const pipelineAICallDelayMs = useSettingsStoreSelector((state) => state.pipelineAICallDelayMs)
  const pipelineSequentialMode = useSettingsStoreSelector((state) => state.pipelineSequentialMode)

  return <>
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
      <SettingFieldRow
        label={t('pipelineMaxAIRequests')}
        value={String(pipelineMaxAIRequests)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelineMaxAIRequests: Math.max(1, Math.min(32, parsed)),
          }))
        }}
      />
      <SettingFieldRow
        label={t('pipelineAICallDelayMs')}
        value={String(pipelineAICallDelayMs)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelineAICallDelayMs: Math.max(0, Math.min(10000, parsed)),
          }))
        }}
      />
      <SettingToggleRow
        label={t('pipelineSequentialMode')}
        selected={pipelineSequentialMode}
        onChange={() => setSetting((prev) => ({
          ...prev,
          pipelineSequentialMode: !prev.pipelineSequentialMode,
        }))}
      />
    </SettingsSection>


  </>
}
