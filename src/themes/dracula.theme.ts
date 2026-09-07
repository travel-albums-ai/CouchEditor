import { generateTheme } from '@/themes/utils';
import { ThemeOptions } from '@mui/material';

export const themeTokens = {
  light: {
    palette: {
      mode: 'light',

      primary: {
        main: '#7C4DFF',
      },

      secondary: {
        main: '#0097A7',
      },

      error: {
        main: '#E53935',
      },

      warning: {
        main: '#F39C12',
      },

      info: {
        main: '#0097A7',
      },

      success: {
        main: '#16A05D',
      },

      background: {
        default: '#F6F6F9',
        paper: '#FFFFFF',
      },

      text: {
        primary: '#24242B',
        secondary: '#6E7080',
        disabled: '#A5A6B0',
      },

      divider: '#E1E1E7',
    },

    shape: {
      borderRadius: 4,
    },

    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

      button: {
        textTransform: 'none',
      },
    },
  } as ThemeOptions,
  dark: {
    palette: {
      mode: 'dark',

      primary: {
        main: '#A970FF',
      },

      secondary: {
        main: '#8BE9FD',
      },

      error: {
        main: '#FF5555',
      },

      warning: {
        main: '#FFB86C',
      },

      info: {
        main: '#8BE9FD',
      },

      success: {
        main: '#50FA7B',
      },

      background: {
        default: '#0F1015',
        paper: '#17181E',
      },

      text: {
        primary: '#E8E8ED',
        secondary: '#85879A',
        disabled: '#555766',
      },

      divider: '#292B36',
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

export { darkTheme as draculaDarkTheme, lightTheme as draculaLightTheme };

export const name = '🧛 Dracula';
