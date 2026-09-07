import GenericToggleButton, { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { supportedLanguages, type SupportedLanguage } from '@/lib/i18n';
import { ToggleButtonGroup } from '@mui/material';

// language codes whose flag country differs from the language code itself
const FLAG_COUNTRY_OVERRIDES: Partial<Record<string, string>> = {
  en: 'GB',
};

const languageDisplayNames = new Intl.DisplayNames(['en'], { type: 'language' });

const ITEMS = supportedLanguages.map((lang) => ({
  value: lang,
  tooltip: languageDisplayNames.of(lang) ?? lang,
  title: '',
  icon: <div className={`fflag fflag-${FLAG_COUNTRY_OVERRIDES[lang] ?? lang.toUpperCase()}`} style={{ width: 16, height: 16, borderRadius: 10 }} />,
})) as GenericToggleButtonProps[];

export default function LocaleToggle() {
  const { setSetting } = useSettings();
  const locale = useSettingsStoreSelector((state) => state.locale);

  return (
    <ToggleButtonGroup
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
