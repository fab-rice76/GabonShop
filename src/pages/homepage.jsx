import React from 'react';
import { Link } from 'react-router-dom';
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
  Chip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Phone as PhoneIcon,
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
  { name: 'Électronique', icon: <ComputerIcon />, color: '#1976d2' },
  { name: 'Mode', icon: <CheckroomIcon />, color: '#9c27b0' },
  { name: 'Maison', icon: <HomeIcon />, color: '#ed6c02' },
  { name: 'Véhicules', icon: <CarIcon />, color: '#2e7d32' },
  { name: 'Loisirs', icon: <SportsIcon />, color: '#d32f2f' },
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
// 🔥 Fonction universelle pour récupérer l'image
const getProductImage = (product) => {
  if (!product) return null;

  // Cas 1 : images = ["url"]
  if (Array.isArray(product.images) && typeof product.images[0] === "string") {
    return product.images[0];
  }

  // Cas 2 : images = [{ url: "..." }]
  if (Array.isArray(product.images) && product.images[0]?.url) {
    return product.images[0].url;
  }

  // Cas 3 : images = "url"
  if (typeof product.images === "string") {
    return product.images;
  }

  // Cas 4 : imageUrl = "url"
  if (product.imageUrl) {
    return product.imageUrl;
  }

  return null;
};

// 🔥 Correction Uploadcare
const getSafeImageUrl = (url) => {
  if (!url) return null;

  // Déjà une vraie image Uploadcare
  if (url.includes("/nth/")) return url;

  // Groupe de fichiers (~uuid)
  if (url.includes("~")) {
    return url.replace(/\/$/, "") + "/nth/0/";
  }

  return url;
};

const HomePage = () => {
  const { currentUser: user } = useAuth();
  const { products } = useProducts();

  // Prendre les 6 produits les plus récents
  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <Container maxWidth="lg" sx={{ width: '100%', maxWidth: '1200px !important' }}>
      {/* Hero Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              GabonShop
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Découvrez et partagez des produits avec la communauté gabonaise
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Barre de recherche rapide */}
      

      {/* Catégories */}
      

      {/* Produits récents */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Produits récents
          </Typography>
          <Button component={Link} to="/products" variant="text" size="small">
            Voir tout →
          </Button>
        </Box>

        {recentProducts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="info" sx={{ textAlign: 'left' }}>
              Aucun produit n'a encore été publié.{' '}
              {user
                ? 'Soyez le premier à partager un article !'
                : 'Connectez-vous pour publier vos trouvailles.'}
            </Alert>
          </Paper>
        ) : (
          <Grid container spacing={3}>
  {recentProducts.map((product) => {
    const rawImage = getProductImage(product);
    const imageUrl = getSafeImageUrl(rawImage);

    return (
      <Grid item xs={12} sm={6} md={4} key={product.id}>
        <Card
          component={Link}
          to={`/products/${product.id}`}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            },
          }}
        >
          {imageUrl ? (
            <CardMedia
              component="img"
              height="240"
              image={imageUrl}
              alt={product.title}
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            <Box
              sx={{
                height: 240,
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Pas d'image
              </Typography>
            </Box>
          )}

          <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '3em',
              }}
            >
              {product.title}
            </Typography>

            {product.price && (
              <Typography
                variant="h6"
                color="primary"
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {formatPrice(product.price)}
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {product.ownerName?.charAt(0) || '?'}
              </Avatar>

              <Typography variant="caption" color="text.secondary">
                {product.ownerName}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                • {formatDate(product.createdAt)}
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
  );
};

export default HomePage;