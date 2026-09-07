import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import useLocaleSync from '@/hooks/useLocaleSync';
import type { ThemeName } from '@/themes';
import { getTheme } from '@/themes';

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { alpha, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import {
  createContext,
  useCallback,
  useMemo,
  type ReactNode
} from 'react';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;

  themeName: ThemeName;
  setThemeName: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

declare module '@mui/material/TextField' {
  interface TextFieldPropsVariantOverrides {
    roundness: true;
  }

  interface TextFieldProps {
    roundness?: 'full' | 'rounded' | 'square';
  }
}

type Props = {
  children: ReactNode;
};

export function ThemeContextProvider({ children }: Props) {
  const { setSetting } = useSettings();
  useLocaleSync();
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);
  const themeId = useSettingsStoreSelector((state) => state.themeId);

  const mode: ThemeMode =
    themeMode === 'dark' ? 'dark' : 'light';

  const themeName: ThemeName =
    (themeId as ThemeName) || 'default';

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setSetting((prev) => ({ ...prev, themeMode: newMode }));
    },
    [setSetting],
  );

  const toggleMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const setThemeName = useCallback(
    (newTheme: ThemeName) => {
      setSetting((prev) => ({ ...prev, themeId: newTheme }));
    },
    [setSetting],
  );

  const muiTheme = useMemo(() => {
    return getTheme(themeName, mode);
  }, [themeName, mode]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode,
      themeName,
      setThemeName,
    }),
    [mode, setMode, toggleMode, themeName, setThemeName],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider
        key={`${themeName}-${mode}`}
        theme={muiTheme}
      >
        <CssBaseline />

        <GlobalStyles
          styles={(theme) => ({
            ':root': {
              '--text': theme.palette.text.primary,
              '--text-secondary': theme.palette.text.secondary,
              '--text-disabled': theme.palette.text.disabled,
              '--text-h': theme.palette.text.primary,
              '--text-muted': theme.palette.text.secondary,
              '--divider': theme.palette.divider,
              '--accent': theme.palette.primary.main,
              '--accent-soft': alpha(theme.palette.primary.main, 0.28),
              '--border': theme.palette.divider,
              '--bg-soft': alpha(theme.palette.background.paper, 0.88),
              '--bg-overlay': alpha(theme.palette.background.default, 0.88),
              '--bg-drawer': theme.palette.main,
              '--bg-paper': theme.palette.background.paper,
              '--bg-default': theme.palette.background.default,
              '--border-radius': `${theme.shape.borderRadius}px`,
            },

            body: {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            },

            '*': {
              scrollbarWidth: 'thin',
              scrollbarColor: `${theme.palette.primary.main}55 transparent`,
            },

            '*::-webkit-scrollbar': {
              width: 16,
              height: 16,
            },

            '*::-webkit-scrollbar-track': {
              background: `${theme.palette.background.paper}22`,
              borderRadius: 999,
            },

            '*::-webkit-scrollbar-thumb': {
              background: `${theme.palette.primary.main}55`,
              borderRadius: 999,
              border: '4px solid transparent',
              backgroundClip: 'padding-box',
            },

            '*::-webkit-scrollbar-thumb:hover': {
              background: `${theme.palette.primary.main}88`,
            },

            '*::-webkit-scrollbar-thumb:active': {
              background: `${theme.palette.primary.main}AA`,
            },
          })}
        />

        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
