import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import SettingsSection from '@/components/SettingsSection';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import SettingsGeneralRow from '@/middleware/windows/settings/components/SettingsGeneralRow';
import { Astroid, TextAlignStart, Turtle } from 'lucide-react';

export default function BYOKOpenAi() {
  const { setSetting } = useBYOK()
  const byokStore = useBYOKStoreSelector((state) => state)

  return <>
    <SettingsSection title="Open AI Prompts" icon={<TextAlignStart />} transparent={true} uuid="byok-openai">
      <SettingsGeneralRow icon={<Astroid />} label="Model">
        <SegmentedControl defaultValue={byokStore.model} onChange={(_, value) => setSetting(prev => ({ ...prev, model: value }))}>
          <SegmentedControlItem value="gpt-5.6-luna" >GPT 5.6 Luna</SegmentedControlItem>

          <SegmentedControlItem value="gpt-5.6-terra" >GPT 5.6 Terra $</SegmentedControlItem>
          <SegmentedControlItem value="gpt-5.6-sol" >GPT 5.6 Sol $+</SegmentedControlItem>
        </SegmentedControl>
      </SettingsGeneralRow>

      <SettingsGeneralRow icon={<Turtle />} label="Priority">
        <SegmentedControl defaultValue={byokStore.serviceTier} onChange={(_, value) => setSetting(prev => ({ ...prev, serviceTier: value }))}>
          <SegmentedControlItem value="flex" >Flex </SegmentedControlItem>
          <SegmentedControlItem value="default" >Default $</SegmentedControlItem>
          <SegmentedControlItem value="priority" >Priority $+</SegmentedControlItem>
        </SegmentedControl>
      </SettingsGeneralRow>
    </SettingsSection>
  </>
}
