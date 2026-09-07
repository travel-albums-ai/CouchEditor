import { ThemeOptions } from '@mui/material';

import { generateTheme } from '@/themes/utils';

export const themeTokens = {
  light: {
    palette: {
      mode: 'light',

      primary: {
        main: '#34548A',
        light: '#3D59A1',
        dark: '#2E4672',
        contrastText: '#FFFFFF',
      },

      secondary: {
        main: '#5A4A78',
        light: '#7E69AB',
        dark: '#46385F',
        contrastText: '#FFFFFF',
      },

      error: {
        main: '#8C4351',
        light: '#A34A5A',
        dark: '#713540',
      },

      warning: {
        main: '#8F5E15',
        light: '#B07A20',
        dark: '#6B4510',
      },

      info: {
        main: '#0F4B6E',
        light: '#166A99',
        dark: '#0B3852',
      },

      success: {
        main: '#33635C',
        light: '#417A70',
        dark: '#274C47',
      },

      background: {
        default: '#E6E7ED',
        paper: '#F7F7FA',
      },

      text: {
        primary: '#343B58',
        secondary: '#565F89',
        disabled: '#9298AF',
      },

      divider: '#C7CAD5',
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
        main: '#7AA2F7',
        light: '#A4C4FF',
        dark: '#5D7FC4',
        contrastText: '#16161E',
      },

      secondary: {
        main: '#BB9AF7',
        light: '#C9B2FF',
        dark: '#9575D5',
        contrastText: '#16161E',
      },

      error: {
        main: '#F7768E',
        light: '#FF9EAB',
        dark: '#C95B70',
      },

      warning: {
        main: '#E0AF68',
        light: '#F2C982',
        dark: '#B7894F',
      },

      info: {
        main: '#7DCFFF',
        light: '#A4E2FF',
        dark: '#5DA8D2',
      },

      success: {
        main: '#9ECE6A',
        light: '#B7E589',
        dark: '#79A850',
      },

      background: {
        default: '#1A1B26',
        paper: '#24283B',
      },

      text: {
        primary: '#C0CAF5',
        secondary: '#A9B1D6',
        disabled: '#565F89',
      },

      divider: '#3B4261',
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
};

export const lightTheme = generateTheme(themeTokens.light);

export const darkTheme = generateTheme(themeTokens.dark);

export {
  darkTheme as tokyoNightDarkTheme,
  lightTheme as tokyoNightLightTheme
};

export const name = '🌃 Tokyo Night';
