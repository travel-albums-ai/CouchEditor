import { themeRegistry } from '@/discovery/themeRegistry';
import { darkTheme as defaultDarkTheme, lightTheme as defaultLightTheme } from './default.theme';

export type ThemeName = string;
export type ThemeMode = 'light' | 'dark';

function selectThemeFromModule(mod: any, id: string, mode: ThemeMode) {
  if (!mod) return null;

  const light = mod.lightTheme ?? mod.defaultLightTheme ?? mod[`${id}LightTheme`];
  const dark = mod.darkTheme ?? mod.defaultDarkTheme ?? mod[`${id}DarkTheme`];

  return mode === 'light' ? light ?? dark : dark ?? light;
}

export function getTheme(name: ThemeName, mode: ThemeMode) {
  const meta = themeRegistry.get(name);

  if (meta?.module) {
    const resolved = selectThemeFromModule(meta.module, meta.id, mode);
    if (resolved) return resolved;
  }

  // fallback: try to use default theme from registry
  const def = themeRegistry.get('default');
  if (def?.module) {
    const resolved = selectThemeFromModule(def.module, def.id, mode);
    if (resolved) return resolved;
  }

  // last resort: return bundled default theme
  return mode === 'light' ? defaultLightTheme : defaultDarkTheme;
}

export const themeNames = () => themeRegistry.all().map((m) => m.id);

export type ThemeOption = { value: string; label: string };
export const themeOptions = (): ThemeOption[] =>
  themeRegistry.all().map((m) => ({ value: m.id, label: m.name ?? m.id }));

export default {
  getTheme,
  themeNames,
  themeOptions,
};
