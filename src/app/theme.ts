'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme( {
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#9575cd',
        },
        secondary: {
          main: '#9ccc65',
        },
        error: {
          main: '#d32f2f',
        },
        warning: {
          main: '#fb8c00',
        },
        info: {
          main: '#3949ab',
        },
        success: {
          main: '#c5e1a5',
        },
      },
    },
    dark: {
      palette: {
        // Slightly lighter shades usually work better for dark mode contrast
        primary: {
          main: '#b39ddb',
        },
        secondary: {
          main: '#c5e1a5',
        },
        error: {
          main: '#ef5350',
        },
        warning: {
          main: '#ffa726',
        },
        info: {
          main: '#5c6bc0',
        },
        success: {
          main: '#dcedc8',
        },
      },
    },
  },
  typography: {
    h1: {
      fontFamily: 'Josefin Sans',
    },
    h2: {
      fontFamily: 'Josefin Sans',
    },
    h3: {
      fontFamily: 'Josefin Sans',
    },
    h4: {
      fontFamily: 'Josefin Sans',
    },
    h5: {
      fontFamily: 'Josefin Sans',
    },
    h6: {
      fontFamily: 'Josefin Sans',
    },
    subtitle1: {
      fontFamily: 'Josefin Sans',
    },
    subtitle2: {
      fontFamily: 'Josefin Sans',
    },
    body1: {
      fontFamily: 'Raleway',
    },
    body2: {
      fontFamily: 'Raleway',
    },
    button: {
      fontFamily: 'Raleway',
    },
    overline: {
      fontFamily: 'Raleway',
    },
    caption: {
      fontFamily: 'Raleway',
    },
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          width  : 46,
          height : 27,
          padding: 0,
          margin : 8,
        },
        switchBase: {
          padding        : 1,
          // Updated to modern MUI v5/v6 selector syntax
          '&.Mui-checked': {
            transform             : 'translateX(16px)',
            color                 : '#fff',
            '& + .MuiSwitch-track': {
              opacity: 1,
              border : 'none',
            },
          },
        },
        thumb: {
          width : 24,
          height: 24,
        },
        track: {
          borderRadius   : 13,
          border         : '1px solid #bdbdbd',
          backgroundColor: '#fafafa',
          opacity        : 1,
          transition:
            'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
  },
} );

export default theme;
