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
  const pipelineJpegQuality = useSettingsStoreSelector((state) => state.pipelineJpegQuality)
  const pipelineImageConcurrency = useSettingsStoreSelector((state) => state.pipelineImageConcurrency)
  const pipelinePhaseCacheMB = useSettingsStoreSelector((state) => state.pipelinePhaseCacheMB)
  const pipelineAICacheMB = useSettingsStoreSelector((state) => state.pipelineAICacheMB)
  const pipelineViewerMaxDimension = useSettingsStoreSelector((state) => state.pipelineViewerMaxDimension)
  const pipelineProgressPreviewMaxDimension = useSettingsStoreSelector((state) => state.pipelineProgressPreviewMaxDimension)
  const pipelineProgressPreviewQuality = useSettingsStoreSelector((state) => state.pipelineProgressPreviewQuality)
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
      <SettingFieldRow
        label={t('pipelineJpegQuality')}
        value={String(pipelineJpegQuality)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelineJpegQuality: Math.max(10, Math.min(100, parsed)),
          }))
        }}
      />
      <SettingFieldRow
        label={t('pipelineImageConcurrency')}
        value={String(pipelineImageConcurrency)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelineImageConcurrency: Math.max(1, Math.min(8, parsed)),
          }))
        }}
      />
      <SettingFieldRow
        label={t('pipelinePhaseCacheMB')}
        value={String(pipelinePhaseCacheMB)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelinePhaseCacheMB: Math.max(0, Math.min(1024, parsed)),
          }))
        }}
      />
      <SettingFieldRow
        label={t('pipelineAICacheMB')}
        value={String(pipelineAICacheMB)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelineAICacheMB: Math.max(0, Math.min(512, parsed)),
          }))
        }}
      />
      <SettingFieldRow
        label={t('pipelineViewerMaxDimension')}
        value={String(pipelineViewerMaxDimension)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelineViewerMaxDimension: Math.max(256, Math.min(4096, parsed)),
          }))
        }}
      />
      <SettingFieldRow
        label={t('pipelineProgressPreviewMaxDimension')}
        value={String(pipelineProgressPreviewMaxDimension)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelineProgressPreviewMaxDimension: Math.max(128, Math.min(1600, parsed)),
          }))
        }}
      />
      <SettingFieldRow
        label={t('pipelineProgressPreviewQuality')}
        value={String(pipelineProgressPreviewQuality)}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10)
          if (Number.isNaN(parsed)) return

          setSetting((prev) => ({
            ...prev,
            pipelineProgressPreviewQuality: Math.max(10, Math.min(100, parsed)),
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
