import { ThemeOptions } from '@mui/material';


export const clownThemeTokens = {
  light: {
    palette: {
      mode: 'light',
      primary: { main: 'red' },
      secondary: { main: 'blue' },
      background: { default: 'yellow', paper: 'green' },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      button: {
        textTransform: 'none',
      }
    },
  } as ThemeOptions,
  dark: {
    palette: {
      mode: 'light',
      primary: { main: '#FF0000' },
      secondary: { main: '#0000FF' },
      background: {
        default: '#5f5f0b',
        paper: '#285e28',
      },
      text: {
        primary: '#2b882b',
        secondary: '#6c8a32',
        disabled: '#1010be',
      },
      action: {
        active: '#771717',
        hover: '#ec780a',
        hoverOpacity: 0.2,
        selected: '#10106b',
        selectedOpacity: 0.2,
        disabled: '#861a86',
        disabledBackground: '#838320',
        disabledOpacity: 0.38,
        focus: '#0f7a0f',
        focusOpacity: 0.12,

      },
      divider: '#a30f0f',
      main: '#c01cc0',
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      }
    },
  } as ThemeOptions,
}
