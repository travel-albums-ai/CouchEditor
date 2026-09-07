import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Auto-discover locale files: src/locales/<lang>.json
const localeModules = import.meta.glob<Record<string, unknown>>('../locales/*.json', {
  eager: true,
  import: 'default',
});

const resources: Record<string, { translation: Record<string, unknown> }> = {};

for (const [path, translation] of Object.entries(localeModules)) {
  const lang = path.split('/').pop()?.replace(/\.json$/, '');
  if (lang) {
    resources[lang] = { translation };
  }
}

export const supportedLanguages = Object.keys(resources).sort() as [string, ...string[]];
export type SupportedLanguage = typeof supportedLanguages[number];

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
