import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Container,
  Paper,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, SentimentDissatisfied } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductsContext';

const MyProductsPage = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const { products, deleteProduct } = useProducts();

  // 🔥 Fonction universelle pour récupérer l'image
  const getProductImage = (product) => {
    if (!product) return null;

    if (Array.isArray(product.images) && typeof product.images[0] === "string") {
      return product.images[0];
    }
    if (Array.isArray(product.images) && product.images[0]?.url) {
      return product.images[0].url;
    }
    if (typeof product.images === "string") {
      return product.images;
    }
    if (product.imageUrl) {
      return product.imageUrl;
    }
    return null;
  };

  const getSafeImageUrl = (url) => {
    if (!url) return null;
    if (url.includes("/nth/")) return url;
    if (url.includes("~")) {
      return url.replace(/\/$/, "") + "/nth/0/";
    }
    return url;
  };

  const myProducts = useMemo(
    () => (currentUser ? products.filter((product) => product.ownerId === currentUser.id) : []),
    [products, currentUser],
  );

  const handleDelete = (productId) => {
    const confirmDelete = window.confirm('Supprimer ce produit ?');
    if (!confirmDelete) return;
    deleteProduct(productId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Vous devez être connecté pour voir vos produits.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mes Produits
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/products/new')}
          sx={{ borderRadius: 2 }}
        >
          Nouveau produit
        </Button>
      </Box>

      {myProducts.length === 0 ? (
        <Paper sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
          borderRadius: 4,
          bgcolor: 'background.paper',
          border: '1px dashed',
          borderColor: 'divider'
        }}>
          <SentimentDissatisfied sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun produit pour le moment
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Commencez à vendre en ajoutant votre premier article.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/products/new')}
          >
            Créer un produit
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {myProducts.map((product) => {
            const imageUrl = getSafeImageUrl(getProductImage(product));

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                  <Box sx={{ position: 'relative', pt: '75%' /* 4:3 Aspect Ratio */ }}>
                    {imageUrl ? (
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={product.title}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'grey.100',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Pas d'image
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap title={product.title}>
                      {product.title}
                    </Typography>

                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      {product.price ? new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XAF',
                        minimumFractionDigits: 0,
                      }).format(product.price) : 'Gratuit'}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Publié le {new Date(product.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      Supprimer
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default MyProductsPage;
