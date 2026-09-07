import { generateTheme } from '@/themes/utils';
import { ThemeOptions } from '@mui/material';

export const themeTokens = {
  light: {
    palette: {
      mode: 'light',
      primary: { main: '#268bd2' },
      secondary: { main: '#2aa198' },
      background: { default: '#fdf6e3', paper: '#ffffff' },
    },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  } as ThemeOptions,
  dark: {
    palette: {
      mode: 'dark',
      primary: { main: '#268bd2' },
      secondary: { main: '#2aa198' },
      background: { default: '#002b36', paper: '#073642' },
    },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  } as ThemeOptions,
}

export const lightTheme = generateTheme(themeTokens.light);

export const darkTheme = generateTheme(themeTokens.dark);

export { darkTheme as solarizedDarkTheme, lightTheme as solarizedLightTheme };

export const name = '🌑 Solarized';
