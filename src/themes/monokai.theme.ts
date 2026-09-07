import { generateTheme } from '@/themes/utils';
import { ThemeOptions } from '@mui/material';

export const themeTokens = {
  light: {
    palette: {
      mode: 'light',
      primary: { main: '#f92672' },
      secondary: { main: '#fd971f' },
      background: { default: '#f8f8f2', paper: '#ffffff' },
    },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  } as ThemeOptions,
  dark: {
    palette: {
      mode: 'dark',
      primary: { main: '#f92672' },
      secondary: { main: '#a6e22e' },
      background: { default: '#272822', paper: '#3a3a2a' },
    },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  } as ThemeOptions,
}

export const lightTheme = generateTheme(themeTokens.light);

export const darkTheme = generateTheme(themeTokens.dark);

export { darkTheme as monokaiDarkTheme, lightTheme as monokaiLightTheme };

export const name = '💛 Monokai';
