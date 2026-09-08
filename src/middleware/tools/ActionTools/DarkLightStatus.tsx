import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
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
    <GenericToggleButtonGroup variant="standard" id="dark-light-toggle" items={[
      {
        tooltip: t('toggleThemeTooltip'),
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
