import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useProducts } from '../../contexts/ProductsContext';

const categories = [
  'Tous',
  'Électronique',
  'Mode & Accessoires',
  'Maison & Jardin',
  'Véhicules',
  'Loisirs & Sport',
  'Autres',
];

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'Tous');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent');

  // 🔥 Fonction universelle pour récupérer l'image
  const getProductImage = (product) => {
    if (!product) return null;

    // Cas 1: images = ["url"]
    if (Array.isArray(product.images) && typeof product.images[0] === "string") {
      return product.images[0];
    }

    // Cas 2: images = [{ url: "..." }]
    if (Array.isArray(product.images) && product.images[0]?.url) {
      return product.images[0].url;
    }

    // Cas 3: images = "url"
    if (typeof product.images === "string") {
      return product.images;
    }

    // Cas 4: imageUrl = "url"
    if (product.imageUrl) {
      return product.imageUrl;
    }

    return null;
  };

  // 🔥 Corrige les URLs Uploadcare (groupe → vraie image)
  const getSafeImageUrl = (url) => {
    if (!url) return null;

    // Si déjà une vraie image
    if (url.includes("/nth/")) return url;

    // Si c'est un groupe (~xxxxx)
    if (url.includes("~")) {
      return url.replace(/\/$/, "") + "/nth/0/";
    }

    return url;
  };

  // Filtrer et trier
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.ownerName?.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price_asc': return (a.price || 0) - (b.price || 0);
        case 'price_desc': return (b.price || 0) - (a.price || 0);
        default: return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'Tous') params.set('category', selectedCategory);
    if (sortBy !== 'recent') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, sortBy, setSearchParams]);

  const formatPrice = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tous les produits
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Barre de recherche */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des produits */}
      {filteredProducts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun produit trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Essayez de modifier vos critères de recherche.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => {
            const imageUrl = getSafeImageUrl(getProductImage(product));

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
    </Container>
  );
};

export default ProductListPage;
