import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import SettingsSection from '@/components/SettingsSection';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import SettingsGeneralRow from '@/middleware/windows/settings/components/SettingsGeneralRow';
import { Astroid, Hash, Image } from 'lucide-react';

export default function BYOKOpenAiImageEditor() {
  const { setSetting } = useBYOK()
  const byokStore = useBYOKStoreSelector((state) => state)

  return <>
    <SettingsSection title="Open AI Image Editor" icon={<Image />} transparent={true} uuid="byok-openai-image-editor">
      <SettingsGeneralRow icon={<Astroid />} label="Editor sModel">
        <SegmentedControl defaultValue={byokStore.imageModel} onChange={(_, value) => setSetting(prev => ({ ...prev, imageModel: value }))}>
          <SegmentedControlItem value="gpt-image-2" >GPT Image 2 $</SegmentedControlItem>

          <SegmentedControlItem value="gpt-image-2.5-sunburst" >GPT Image 2.5 Sunburst $+</SegmentedControlItem>
          <SegmentedControlItem value="gpt-image-2.5-flare" >GPT Image 2.5 Flare $+</SegmentedControlItem>
        </SegmentedControl>
      </SettingsGeneralRow>

      <SettingsGeneralRow icon={<Hash />} label="Quality">
        <SegmentedControl defaultValue={byokStore.imageQuality} onChange={(_, value) => setSetting(prev => ({ ...prev, imageQuality: value }))}>
          <SegmentedControlItem value="low" >Low </SegmentedControlItem>
          <SegmentedControlItem value="medium" >Medium $ </SegmentedControlItem>
          <SegmentedControlItem value="high" >High $+</SegmentedControlItem>
        </SegmentedControl>
      </SettingsGeneralRow>
    </SettingsSection>
  </>
}
