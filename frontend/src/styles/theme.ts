import { type ThemeOptions, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import type {} from '@mui/x-data-grid/themeAugmentation';

// Augment the palette to include an green color
declare module '@mui/material/styles' {
  interface Palette {
    green: Palette['primary'];
  }

  interface PaletteOptions {
    green?: PaletteOptions['primary'];
  }
}

// Update the Button's color options to include a green option
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    green: true;
  }
}

// Create a theme instance.
let theme = createTheme({
  palette: {
    primary: {
      dark: '#0D2951',
      main: '#194876',
      light: '#EDF2F7',
    },
    secondary: {
      dark: '#E78A16',
      main: '#EFA727',
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: '#000000',
    },
    green: {
      dark: '#1A5034',
      main: '#2C6F4F',
      light: '#C0D4CA',
    },
  },
  typography: {
    fontFamily: 'verdana',
    h3: {
      fontSize: '40px',
      '@media (min-width:720px)': {
        fontSize: '48px',
      },
    },
    h4: {
      fontSize: '30px',
    },
    h6: {
      fontSize: '22px',
    },
  },
});

// Theme composition: using theme options to define other options
theme = createTheme(theme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'always',
        color: theme.palette.green.main,
        fontWeight: 'bold',
      },
    },
    MuiButton: {
      defaultProps: {
        disableFocusRipple: true,
      },
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          '&:hover, &:focus': {
            textDecoration: 'underline',
          },
        },
        containedSecondary: {
          '&:focus': {
            backgroundColor: theme.palette.secondary.dark,
          },
        },
        sizeSmall: {
          fontSize: '14px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary.dark,
          color: 'white',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaderTitle: {
          fontWeight: 'bold',
        },
        row: {
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.light,
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
            },
          },
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 4,
      },
      styleOverrides: {
        root: {
          '&.Mui-expanded': {
            marginBottom: 24,
          },
        },
      },
    },
  },
} as ThemeOptions);

export default theme;
