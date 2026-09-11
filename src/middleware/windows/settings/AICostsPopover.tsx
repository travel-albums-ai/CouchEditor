import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import BYOKCosts from '@/middleware/windows/settings/byok/BYOKCosts';
import { Astroid, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'enableAI', labelKey: 'Open AI', value: 'show-people-and-pets', type: 'boolean', icon: <Astroid size={16} /> },
  { key: 'byokOpenAIKey', labelKey: 'Open AI Key', value: 'show-people-and-pets', type: 'field', icon: <Key size={16} /> },
] as const

export default function AICostsPopover() {
  const { setSetting } = useBYOK()
  const byokStore = useBYOKStoreSelector((state) => state)
  const { getMainPersona, getAdditionalPersonas, addAdditionalPersona } = useBYOK()
  const { t } = useTranslation()

  return <>
    {/* <SettingsSection title="AI via Bring Your Own Key (BYOK)" icon={<Key />} transparent={true} uuid="byok-toggle-ai">
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
          <Button startIcon={<UserKey size={16} />} size="small" color="inherit" variant="outlined">Get your OpenAI API key</Button>
        </a>
      </Box>
    </SettingsSection>

    <BYOKOpenAi /> */}

    <BYOKCosts />

    {/* <SettingsSection title="AI identifiable personas" icon={<PersonStanding />} uuid="byok-personas">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, justifyContent: 'space-between' }}>
        <Typography variant="subtitle2">Identify personas in photos</Typography>
        <Button variant="outlined" size="small" color="primary" onClick={() => addAdditionalPersona({ name: '', description: '' })}><Plus size={16} /></Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <BYOKPersona persona={getMainPersona()} main={true} index={0} />
        {getAdditionalPersonas().map((persona, index) => <BYOKPersona persona={persona} main={false} index={index} key={index} />)}
      </Box>
    </SettingsSection>
 */}

  </>
}
