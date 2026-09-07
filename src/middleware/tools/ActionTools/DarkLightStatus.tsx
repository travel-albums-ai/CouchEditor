import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { MoonStar, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DarkLightStatus() {
  const { setSetting } = useSettings()
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);
  const { t } = useTranslation()

  const handleOnChange = (mode?: 'light' | 'dark') => {
    setSetting((prev) => ({ ...prev, themeMode: mode === 'light' ? 'dark' : 'light'}))
  }

  return <>
    <WebMCPDataRun
      name="toggle_theme"
      description="Switch the application between light and dark theme."
      inputSchema={{
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            enum: ['light', 'dark'],
            description: 'Theme to switch to between white and dark',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ mode }: { mode?: 'light' | 'dark' }) => {
        handleOnChange(mode === 'light' ? 'dark' : 'light');

        return { themeMode: mode === 'light' ? 'dark' : 'light' };
      }}
    />

    <GenericToggleButtonGroup variant="standard" id="dark-light-toggle" items={[
      {
        tooltip: t('toggleThemeTooltip'),
        webMcp: true,
        kbd: 'Alt+`',
        meta: {
          name: t('toggleThemeName'),
          description: t('toggleThemeDescription'),
          icon: themeMode === 'light' ? <MoonStar /> : <Sun />,
          group: 'Appearance'
        },
        icon: themeMode === 'light' ? <MoonStar /> : <Sun />,
        onClick: () => handleOnChange(themeMode),
        selected: themeMode !== 'dark',
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
