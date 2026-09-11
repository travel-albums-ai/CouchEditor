import SettingsSection from '@/components/SettingsSection';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import BYOKOpenAi from '@/middleware/windows/settings/byok/BYOKOpenAi';
import BYOKOpenAiImageEditor from '@/middleware/windows/settings/byok/BYOKOpenAiImageEditor';
import SettingFieldRow from '@/middleware/windows/settings/components/SettingFieldRow';
import SettingToggleRow from '@/middleware/windows/settings/components/SettingToggleRow';
import { Box, Button } from '@mui/material';
import { Astroid, Coins, Key, ScrollText, UserKey } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'enableAI', labelKey: 'byokEnableAi', value: 'show-people-and-pets', type: 'boolean', icon: <Astroid size={16} /> },
  { key: 'byokOpenAIKey', labelKey: 'byokOpenAiKey', value: 'show-people-and-pets', type: 'field', icon: <Key size={16} /> },
] as const

export default function BYOKPopover() {
  const { setSetting } = useBYOK()
  const byokStore = useBYOKStoreSelector((state) => state)
  const { t } = useTranslation()

  return <>
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
      <a href="https://developers.openai.com/api/docs/pricing" target="_blank" rel="noopener noreferrer" style={{ marginTop: '8px', alignSelf: 'flex-start', color: 'inherit' }}>
        <Button size="small" startIcon={<ScrollText size={16} />} variant="outlined">Explore the costs</Button>
      </a>
      <a href="https://platform.openai.com/usage" target="_blank" rel="noopener noreferrer" style={{ marginTop: '8px', alignSelf: 'flex-start', color: 'inherit' }}>
        <Button size="small" startIcon={<Coins size={16} />} variant="outlined">Explore usage</Button>
      </a>
    </Box>

    <SettingsSection title={t('byokSectionTitle')} icon={<Key />} transparent={true} uuid="byok-toggle-ai">
      {toggleControls
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'boolean' && <SettingToggleRow
              icon={control.icon}
              label={t(control.labelKey)}
              selected={byokStore[control.key]}
              onChange={() => {
                console.log('toggle', control.key, !byokStore[control.key])
                setSetting(prev => ({ ...prev, [control.key]: !prev[control.key] }))
              }}
            />}
            {control.type === 'field' &&   <SettingFieldRow
              icon={control.icon}
              key={control.key}
              label={t(control.labelKey)}
              value={byokStore[control.key]}
              onChange={(newValue) => setSetting(prev => ({ ...prev, [control.key]: newValue }))}
            />}
          </Fragment>
        ))}

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
        <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" style={{ marginTop: '8px', alignSelf: 'flex-start', color: 'inherit' }}>
          <Button startIcon={<UserKey size={16} />} size="small" variant="outlined">{t('byokGetApiKey')}</Button>
        </a>
      </Box>
    </SettingsSection>

    {byokStore.enableAI && byokStore.byokOpenAIKey && <>
      <BYOKOpenAi />
      <BYOKOpenAiImageEditor />
    </>}

  </>
}
