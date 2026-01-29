import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
        width: '100%',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ maxWidth: '1200px !important', margin: '0 auto' }}
      >
        <Grid container spacing={4}>
          {/* À propos */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              GabonShop
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Plateforme dédiée à la mise en relation des commerçants et des
              clients du Gabon. Achetez et vendez en toute simplicité.
            </Typography>
          </Grid>

          {/* Liens rapides */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Liens rapides
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/" color="inherit" underline="hover">
                Accueil
              </MuiLink>
              <MuiLink
                component={Link}
                to="/products"
                color="inherit"
                underline="hover"
              >
                Produits
              </MuiLink>
              <MuiLink
                component={Link}
                to="/login"
                color="inherit"
                underline="hover"
              >
                Connexion
              </MuiLink>
            </Box>
          </Grid>

          {/* Aide et Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Aide & Support
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink
                component={Link}
                to="/help/comment-ca-marche"
                color="inherit"
                underline="hover"
              >
                Comment ça marche ?
              </MuiLink>
              <MuiLink
                component={Link}
                to="/help/faq"
                color="inherit"
                underline="hover"
              >
                Foire aux questions (FAQ)
              </MuiLink>
              <MuiLink
                component={Link}
                to="/legal/conditions"
                color="inherit"
                underline="hover"
              >
                Conditions d'utilisation
              </MuiLink>
              <MuiLink
                component={Link}
                to="/legal/confidentialite"
                color="inherit"
                underline="hover"
              >
                Politique de confidentialité
              </MuiLink>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">+241 74031774</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2">skydevagency@gmail.com</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" />
                <Typography variant="body2">Libreville, Gabon</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bas de page */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {currentYear} GabonShop. Tous droits réservés.
          </Typography>

          <Typography
            variant="body2"
            sx={{ opacity: 0.9, fontStyle: 'italic' }}
          >
            Développé par <strong>SkyDev Agency</strong>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
