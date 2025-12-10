import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductsContext';

const MyProductsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { products, deleteProduct } = useProducts();

  // 🟦 Fonction universelle pour récupérer l'image
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

    // Cas 4 : imageUrl unique
    if (product.imageUrl) {
      return product.imageUrl;
    }

    return null;
  };

  // 🟩 Correction Uploadcare → vraie image
  const getSafeImageUrl = (url) => {
    if (!url) return null;

    // Si déjà /nth/
    if (url.includes("/nth/")) return url;

    // Si c'est un groupe (~)
    if (url.includes("~")) {
      return url.replace(/\/$/, "") + "/nth/0/";
    }

    return url;
  };

  const myProducts = useMemo(
    () => (currentUser ? products.filter((product) => product.ownerId === currentUser.id) : []),
    [products, currentUser],
  );

  if (!currentUser) {
    return (
      <Container maxWidth="md">
        <Alert
          severity="info"
          action={
            <Button component={Link} to="/login" color="inherit" size="small">
              Me connecter
            </Button>
          }
        >
          Connectez-vous pour gérer vos produits.
        </Alert>
      </Container>
    );
  }

  const handleDelete = (productId) => {
    const confirmDelete = window.confirm('Supprimer ce produit ?');
    if (!confirmDelete) return;
    deleteProduct(productId, currentUser.id);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Mes produits
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ajoutez, mettez à jour ou supprimez vos publications.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/products/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Nouveau produit
        </Button>
      </Box>

      {myProducts.length === 0 ? (
        <Alert severity="info">
          Vous n&apos;avez pas encore publié de produit. Cliquez sur « Nouveau produit » pour vous lancer.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {myProducts.map((product) => {
            const imageUrl = getSafeImageUrl(getProductImage(product));

            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {imageUrl ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={imageUrl}
                      alt={product.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 200,
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

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Dernière mise à jour le{' '}
                      {new Date(product.updatedAt).toLocaleDateString('fr-FR')}
                    </Typography>

                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {product.description}
                    </Typography>

                    {product.price && (
                      <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF',
                          minimumFractionDigits: 0,
                        }).format(product.price)}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      startIcon={<DeleteIcon />}
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
