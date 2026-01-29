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
  Divider,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useProducts } from '../../contexts/ProductsContext';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'Tous');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent');

  const categories = [
    'Tous', 'Véhicules', 'Immobilier', 'Informatique', 'Mode', 'Maison', 'Loisirs', 'Autres'
  ];

  // Helper functions
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

  const formatPrice = (price) => {
    if (!price) return 'Prix à débattre';
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
    if (diffMs < 86400000) return "Aujourd'hui";
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'price_asc': return (a.price || 0) - (b.price || 0);
        case 'price_desc': return (b.price || 0) - (a.price || 0);
        default: return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, sortBy, selectedCategory]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'Tous') params.set('category', selectedCategory);
    if (sortBy !== 'recent') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, sortBy, setSearchParams]);

  return (
    <Box sx={{ bgcolor: '#f5f7f9', minHeight: '100vh', pb: 10 }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 4, mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="900" gutterBottom>
            Que recherchez-vous ?
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 400 }, bgcolor: '#f4f6f7', borderRadius: 2, '& fieldset': { border: 'none' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl sx={{ minWidth: 200, bgcolor: '#f4f6f7', borderRadius: 2, '& fieldset': { border: 'none' } }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty
                size="small"
                sx={{ py: 0.5 }}
              >
                <MenuItem value="recent">Plus récents</MenuItem>
                <MenuItem value="price_asc">Prix croissant</MenuItem>
                <MenuItem value="price_desc">Prix décroissant</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                color={selectedCategory === cat ? "primary" : "default"}
                sx={{
                  borderRadius: 1.5,
                  fontWeight: 'bold',
                  px: 1,
                  bgcolor: selectedCategory === cat ? 'primary.main' : 'white',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'primary.main' : 'divider'
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''}
          </Typography>
        </Box>

        {filteredProducts.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }}>
            <FilterIcon sx={{ fontSize: 60, color: 'divider', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Oups ! Aucun article ne correspond à votre recherche
            </Typography>
            <Button variant="outlined" onClick={() => { setSearchQuery(''); setSelectedCategory('Tous'); }} sx={{ mt: 2 }}>
              Réinitialiser les filtres
            </Button>
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
                        boxShadow: '0 12px 20px rgba(0,0,0,0.08)',
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
                        {formatPrice(product.price)}
                      </Typography>

                      <Divider sx={{ my: 1.5, opacity: 0.5 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon fontSize="inherit" /> {product.location || 'Gabon'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon fontSize="inherit" /> {formatDate(product.createdAt)}
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
    </Box>
  );
};

export default ProductListPage;
