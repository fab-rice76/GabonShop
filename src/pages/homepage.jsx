import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  InputAdornment,
  TextField,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Category as CategoryIcon,
  Computer as ComputerIcon,
  Checkroom as CheckroomIcon,
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  SportsEsports as SportsIcon,
  MoreHoriz as MoreIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductsContext';

const categories = [
  { id: 'auto', label: 'Véhicules', icon: <CarIcon /> },
  { id: 'immo', label: 'Immobilier', icon: <HomeIcon /> },
  { id: 'elec', label: 'Informatique', icon: <ComputerIcon /> },
  { id: 'mode', label: 'Mode', icon: <CheckroomIcon /> },
  { id: 'maison', label: 'Maison', icon: <CategoryIcon /> },
  { id: 'loisir', label: 'Loisirs', icon: <SportsIcon /> },
  { id: 'autre', label: 'Autres', icon: <MoreIcon /> },
];

const formatPrice = (price) => {
  if (!price) return null;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  if (diffDays < 7) return `Il y a ${diffDays} j`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

const getProductImage = (product) => {
  if (!product) return null;
  if (Array.isArray(product.images) && typeof product.images[0] === "string") return product.images[0];
  if (Array.isArray(product.images) && product.images[0]?.url) return product.images[0].url;
  if (typeof product.images === "string") return product.images;
  if (product.imageUrl) return product.imageUrl;
  return null;
};

const getSafeImageUrl = (url) => {
  if (!url) return null;
  if (url.includes("/nth/")) return url;
  if (url.includes("~")) return url.replace(/\/$/, "") + "/nth/0/";
  return url;
};

const HomePage = () => {
  const { currentUser: user } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <Box sx={{ bgcolor: '#f5f7f9', minHeight: '100vh', pb: 8, mt: -4 }}>
      {/* Hero Section pro */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 8, md: 15 },
          textAlign: 'center',
          mb: 4
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight={900} gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, textShadow: '2px 2px 4px rgba(0,0,0,0.3)', letterSpacing: '-1px' }}>
            Achetez et vendez au Gabon
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            La plateforme n°1 pour vos petites annonces. Simple, rapide et 100% Gabonais.
          </Typography>

          {/* New Pro Search Bar */}
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              p: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              mx: 'auto',
              maxWidth: 800
            }}
          >
            <TextField
              fullWidth
              placeholder="Que recherchez-vous aujourd'hui ?"
              variant="standard"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 2 }}>
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { fontSize: '1.2rem', py: 1 }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: 2.5,
                px: 5,
                fontWeight: 'bold',
                textTransform: 'none',
                ml: 1,
                fontSize: '1rem'
              }}
            >
              Rechercher
            </Button>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Catégories icons */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" fontWeight="900" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            Top Catégories
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {categories.map((cat) => (
              <Grid item xs={6} sm={4} md={1.7} key={cat.id}>
                <Paper
                  component={Link}
                  to={`/products?category=${cat.id}`}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    borderRadius: 4,
                    textDecoration: 'none',
                    color: 'inherit',
                    bgcolor: 'white',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                      borderColor: 'primary.main',
                      '& .MuiAvatar-root': { bgcolor: 'primary.main', color: 'white' }
                    }
                  }}
                >
                  <Avatar sx={{ bgcolor: '#f0f2f5', color: 'text.secondary', width: 60, height: 60, transition: 'all 0.3s' }}>
                    {cat.icon}
                  </Avatar>
                  <Typography variant="body2" fontWeight="700" textAlign="center">
                    {cat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Produits récents */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h5" fontWeight="900">
                Annonces récentes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Les dernières pépites publiées par la communauté
              </Typography>
            </Box>
            <Button component={Link} to="/products" variant="outlined" color="primary" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}>
              Voir toutes les annonces
            </Button>
          </Box>

          {recentProducts.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'white', border: '1px dashed', borderColor: 'divider' }}>
              <CategoryIcon sx={{ fontSize: 60, color: 'divider', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                C'est bien calme par ici...
              </Typography>
              <Button component={Link} to="/products/new" variant="contained" sx={{ mt: 2 }}>
                Publier la première annonce
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {recentProducts.map((product) => {
                const imageUrl = getSafeImageUrl(getProductImage(product));

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card
                      component={Link}
                      to={`/products/${product.id}`}
                      elevation={0}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative', pt: '75%' }}>
                        {imageUrl ? (
                          <CardMedia
                            component="img"
                            image={imageUrl}
                            alt={product.title}
                            sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Box sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Pas d'image</Typography>
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>
                          {product.title}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="900" sx={{ mb: 2 }}>
                          {formatPrice(product.price) || 'Prix à débattre'}
                        </Typography>

                        <Divider sx={{ my: 1.5, opacity: 0.5 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <HomeIcon fontSize="inherit" /> {product.location || 'Gabon'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(product.createdAt)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;