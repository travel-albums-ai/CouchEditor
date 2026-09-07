import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';

export const generateTheme = (tokens: ThemeOptions) => createTheme({
  ...tokens,

  // palette: {
  //   ...tokens.palette,
  //   background: {
  //     ...tokens.palette?.background,
  //     default: Color(tokens.palette?.background?.default).mix(Color(tokens.palette?.primary?.main), 0.065).hex(),
  //     paper: Color(tokens.palette?.background?.paper).mix(Color(tokens.palette?.primary?.main), 0.065).hex(),
  //   },
  //   text: {
  //     ...tokens.palette?.text,
  //     primary: Color(tokens.palette?.text?.primary).mix(Color(tokens.palette?.primary?.main), 0.25).toString(),
  //     secondary: Color(tokens.palette?.text?.secondary).mix(Color(tokens.palette?.primary?.main), 0.25).toString(),
  //     disabled: Color(tokens.palette?.text?.disabled).mix(Color(tokens.palette?.primary?.main), 0.25).toString(),
  //   },
  // },

  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: '0px',

          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.background.default,
            border: '0px',
          },
        }),
      },

      defaultProps: {
        roundness: 'rounded',
      },

      variants: [
        {
          props: { roundness: 'full' },
          style: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
        {
          props: { roundness: 'rounded' },
          style: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
        {
          props: { roundness: 'square' },
          style: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      ],
    },

    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          maxHeight: '75vh',
          padding: theme.spacing(2),
          overflowY: 'auto',
          borderRadius: Number(theme.shape.borderRadius) * 4,
          backgroundColor: `${theme.palette.background.paper}CC`,
          backdropFilter: 'blur(4px)',
          border: `2px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[24],
        }),
        backdrop: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(1px)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.paper}BB`,
          backdropFilter: 'blur(2px)',
          color: `${theme.palette.text.primary}`,
          boxShadow: theme.shadows[4],
        }),
        arrow: ({ theme }) => ({
          color: `${theme.palette.background.paper}BB`,
        }),
      },
    },

    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) * 2,
        }),
      },
    },

    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) * 3,
        }),
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(30, 30, 30, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.paper}BD`,
          backdropFilter: 'blur(16px)',
        }),
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&::before': {
            display: 'none',
          },

          border: '1px solid',
          borderColor: theme.palette.divider,

          borderRadius: Number(theme.shape.borderRadius) * 3,

          '&:first-of-type': {
            borderTopLeftRadius: Number(theme.shape.borderRadius) * 3,
            borderTopRightRadius: Number(theme.shape.borderRadius) * 3,
          },

          '&:last-of-type': {
            borderBottomLeftRadius: Number(theme.shape.borderRadius) * 3,
            borderBottomRightRadius: Number(theme.shape.borderRadius) * 3,
          },
        }),
      },
    },
  },
});
