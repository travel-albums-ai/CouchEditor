import GenericToggleButton, { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { supportedLanguages, type SupportedLanguage } from '@/lib/i18n';
import { ToggleButtonGroup, useTheme } from '@mui/material';

const FLAG_COUNTRY_OVERRIDES: Partial<Record<string, string>> = {
  en: 'GB',
  uk: 'UA',
};

const languageDisplayNames = new Intl.DisplayNames(['en'], { type: 'language' });

export default function LocaleToggle() {
  const { setSetting } = useSettings();
  const locale = useSettingsStoreSelector((state) => state.locale);
  const theme = useTheme();

  const ITEMS = supportedLanguages.map((lang) => ({
    value: lang,
    tooltip: languageDisplayNames.of(lang) ?? lang,
    title: '',
    icon: <div style={{ border: `1px solid ${theme.palette.divider}`, lineHeight: 0, borderRadius: 10 }}>
      <div className={`fflag fflag-${FLAG_COUNTRY_OVERRIDES[lang] ?? lang.toUpperCase()}`} style={{ width: 16, aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: '16px', lineHeight: 0 }} />
    </div>,
  })) as GenericToggleButtonProps[];


  return (
    <ToggleButtonGroup
      sx={{ display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap', width: '400px' }}
      value={locale}
      exclusive
      onChange={(_, newLocale: SupportedLanguage) => {
        if (newLocale) {
          setSetting((prev) => ({ ...prev, locale: newLocale }));
        }
      }}
    >
      {ITEMS.map((item) => (
        <GenericToggleButton key={String(item.value)} item={item} variant="outlined" />
      ))}
    </ToggleButtonGroup>
  );
}
