import { useSettingsStoreSelector } from '@/context/settingsStore';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';

export default function useLocaleSync() {
  const locale = useSettingsStoreSelector((state) => state.locale);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);
}
