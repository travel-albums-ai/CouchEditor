import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { MapPin, MapPinX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MapAllToggle() {
  const { setSetting } = useSettings()
  const showMapAll = useSettingsStoreSelector((state) => state.showMapAll)
  const { t } = useTranslation()

  const handleOnChange = (show?: boolean) => setSetting((prev) => ({ ...prev, showMapAll: show ?? !prev.showMapAll}));

  return <>
    <WebMCPDataRun
      name="toggle_map_all"
      description="Toggle the 'Map All' feature."
      inputSchema={{
        type: 'object',
        properties: {
          show: {
            type: 'boolean',
            description: 'Whether to show all map pins',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ show }: { show?: boolean }) => {
        handleOnChange(show);

        return { showMapAll: show ?? !showMapAll };
      }}
    />

    <GenericToggleButtonGroup items={[
      {
        tooltip: t('toggleMapAll'),
        onClick: () => handleOnChange(),
        icon: showMapAll ? <MapPin size={20} /> : <MapPinX size={20} />,
        selected: showMapAll,
      },
    ] satisfies GenericToggleButtonProps[]} variant="standard" />
  </>;
}
