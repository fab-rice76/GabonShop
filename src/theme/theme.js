import { createTheme } from '@mui/material/styles';

/**
 * Thème personnalisé pour GabonShop
 * Palette inspirée des couleurs du Gabon (Vert, Jaune, Bleu) avec une touche moderne et premium.
 */
const theme = createTheme({
    palette: {
        primary: {
            main: '#009E60', // Vert Gabon (Forêt)
            light: '#4CAF50',
            dark: '#006030',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FCD116', // Jaune Gabon (Soleil)
            light: '#FFECB3',
            dark: '#C7A500',
            contrastText: '#000000',
        },
        info: {
            main: '#3A75C4', // Bleu Gabon (Mer)
            light: '#64B5F6',
            dark: '#1976D2',
        },
        background: {
            default: '#F4F6F8', // Gris très très clair pour le fond de page
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A2027',
            secondary: '#5E6C84',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#1A2027',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
        button: {
            textTransform: 'none', // Plus moderne
            fontWeight: 600,
            borderRadius: 8,
        },
    },
    shape: {
        borderRadius: 12, // Coins plus arrondis pour un look moderne
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #009E60 30%, #4CAF50 90%)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.05)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        transition: 'all 0.2s',
                        '&:hover fieldset': {
                            borderColor: '#009E60',
                        },
                        '&.Mui-focused fieldset': {
                            borderWidth: 2,
                        },
                    },
                },
            },
        },
    },
});

export default theme;
