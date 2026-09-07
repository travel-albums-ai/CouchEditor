import { generateTheme } from '@/themes/utils';
import { ThemeOptions } from '@mui/material';

export const themeTokens = {
  light: {
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: { default: '#fafafa', paper: '#ffffff' },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      }
    },
  } as ThemeOptions,
  dark: {
    palette: {
      mode: 'dark',
      primary: { main: '#f05a1e' },
      secondary: { main: '#f48fb1' },
      background: { default: '#0f151d', paper: '#141822' },
      text: {
        primary: '#e0e0e0',
        secondary: '#b0b0b0',
        disabled: '#808080',
      }
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      }
    },
  } as ThemeOptions,
}

export const lightTheme = generateTheme(themeTokens.light);

export const darkTheme = generateTheme(themeTokens.dark);

export { darkTheme as defaultDarkTheme, lightTheme as defaultLightTheme };

export const name = 'default';
