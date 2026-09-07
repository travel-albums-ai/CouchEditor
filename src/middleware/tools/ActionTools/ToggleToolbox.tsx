import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import { PanelLeftDashed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ToggleToolbox() {
  // const { setSetting } = useSettings()
  // const themeMode = useSettingsStoreSelector((state) => state.);
  const showToolbox = usePipelineStoreSelector(state => state.showToolbox);
  const { toggleToolbox } = usePipelineStore();
  const { t } = useTranslation()

  // const handleOnChange = (mode?: 'light' | 'dark') => {
  //   setSetting((prev) => ({ ...prev, themeMode: mode === 'light' ? 'dark' : 'light'}))
  // }

  return <>
    <GenericToggleButtonGroup variant="standard" id="toggle-toolbox-toggle" items={[
      {
        tooltip: "Toggle Toolbox",
        icon: <PanelLeftDashed />,
        onClick: () => toggleToolbox(),
        selected: showToolbox,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
