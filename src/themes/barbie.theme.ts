import { generateTheme } from '@/themes/utils';
import { ThemeOptions } from '@mui/material';

export const themeTokens = {
  light: {
    palette: {
      mode: 'light',
      primary: { main: '#ff4081' },
      secondary: { main: '#f06292' },
      background: { default: '#fff5fb', paper: '#ffffff' },
    },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  } as ThemeOptions,
  dark: {
    palette: {
      mode: 'dark',
      primary: { main: '#ff79c6', contrastText: '#2a0710' },
      secondary: { main: '#ff4081', contrastText: '#2a0710' },
      error: { main: '#ff6b6b', contrastText: '#2a0710' },
      warning: { main: '#ffb74d', contrastText: '#2a0710' },
      info: { main: '#4fc3f7', contrastText: '#02182a' },
      success: { main: '#66bb6a', contrastText: '#051207' },
      background: { default: '#1a0a12', paper: '#24121a' },
      text: { primary: '#ffe8f2', secondary: 'rgba(255,232,242,0.72)' },
      divider: 'rgba(255,255,255,0.06)',
      action: {
        active: 'rgba(255,255,255,0.87)',
        hover: 'rgba(255,121,198,0.06)',
        selected: 'rgba(255,121,198,0.12)',
        disabled: 'rgba(255,255,255,0.26)',
        disabledBackground: 'rgba(255,255,255,0.08)',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2rem' },
      h2: { fontWeight: 600, fontSize: '1.6rem' },
      h3: { fontWeight: 600, fontSize: '1.375rem' },
      body1: { fontSize: '1rem' },
      body2: { fontSize: '0.875rem' },
    },
    shape: { borderRadius: 8 },
    spacing: 8,
  } as ThemeOptions,
}

export const lightTheme = generateTheme(themeTokens.light);

export const darkTheme = generateTheme(themeTokens.dark);

export { darkTheme as barbieDarkTheme, lightTheme as barbieLightTheme };

export const name = '💖 Barbie';
