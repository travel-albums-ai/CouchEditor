import { ThemeOptions } from '@mui/material';

import { generateTheme } from '@/themes/utils';

export const themeTokens = {
  light: {
    palette: {
      mode: 'light',

      primary: {
        main: '#8839EF', // Mauve
        light: '#9D5CFF',
        dark: '#6F27C9',
        contrastText: '#FFFFFF',
      },

      secondary: {
        main: '#1E66F5', // Blue
        light: '#4D87FF',
        dark: '#1550C7',
        contrastText: '#FFFFFF',
      },

      error: {
        main: '#D20F39', // Red
        light: '#E6455F',
        dark: '#A50C2F',
      },

      warning: {
        main: '#DF8E1D', // Yellow
        light: '#F0AA45',
        dark: '#B87014',
      },

      info: {
        main: '#04A5E5', // Sky
        light: '#38B8EA',
        dark: '#0382B5',
      },

      success: {
        main: '#40A02B', // Green
        light: '#63B953',
        dark: '#328021',
      },

      background: {
        default: '#EFF1F5', // Base
        paper: '#E6E9EF',   // Mantle
      },

      text: {
        primary: '#4C4F69',   // Text
        secondary: '#6C6F85', // Subtext0
        disabled: '#9CA0B0',  // Overlay0
      },

      divider: '#CCD0DA', // Surface0
    },

    shape: {
      borderRadius: 6,
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
        main: '#CBA6F7', // Mauve
        light: '#D8BFFF',
        dark: '#A87DE0',
        contrastText: '#1E1E2E',
      },

      secondary: {
        main: '#89B4FA', // Blue
        light: '#A8C7FF',
        dark: '#6F96D8',
        contrastText: '#1E1E2E',
      },

      error: {
        main: '#F38BA8', // Red
        light: '#F6A6BA',
        dark: '#D96F8D',
      },

      warning: {
        main: '#F9E2AF', // Yellow
        light: '#FAE9C7',
        dark: '#D6BC8D',
      },

      info: {
        main: '#89DCEB', // Sky
        light: '#A7E7F2',
        dark: '#6DB8C7',
      },

      success: {
        main: '#A6E3A1', // Green
        light: '#BCEBB8',
        dark: '#87C782',
      },

      background: {
        default: '#1E1E2E', // Base
        paper: '#181825',   // Mantle
      },

      text: {
        primary: '#CDD6F4',   // Text
        secondary: '#BAC2DE', // Subtext1
        disabled: '#6C7086',  // Overlay0
      },

      divider: '#313244', // Surface0
    },

    shape: {
      borderRadius: 6,
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
  darkTheme as catppuccinDarkTheme,
  lightTheme as catppuccinLightTheme
};

export const name = '🐈 Catppuccin';
