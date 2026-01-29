import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Breadcrumbs,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Share as ShareIcon,
  FavoriteBorder as FavoriteIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useProducts } from '../../contexts/ProductsContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { products } = useProducts();

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  const getAllProductImages = (p) => {
    if (!p) return [];
    if (Array.isArray(p.images) && typeof p.images[0] === "string") return p.images;
    if (Array.isArray(p.images) && p.images[0]?.url) return p.images.map(img => img.url);
    if (typeof p.images === "string") return [p.images];
    if (p.imageUrl) return [p.imageUrl];
    return [];
  };

  const getSafeImageUrl = (url) => {
    if (!url) return null;
    if (url.includes("/nth/")) return url;
    if (url.includes("~")) return url.replace(/\/$/, "") + "/nth/0/";
    return url;
  };

  const allImages = useMemo(() => {
    return getAllProductImages(product).map(url => getSafeImageUrl(url));
  }, [product]);

  const [mainImage, setMainImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  React.useEffect(() => {
    if (allImages.length > 0) setMainImage(allImages[0]);
  }, [allImages]);

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Produit introuvable</Typography>
          <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>Voir toutes les annonces</Button>
        </Paper>
      </Container>
    );
  }

  const formatPrice = (price) => {
    if (!price) return 'Prix à débattre';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Extraction et formatage du numéro WhatsApp
  const extractPhoneNumber = () => {
    const rawPhone = product?.ownerPhone || product?.phone || product?.ownerContact || product?.ownerWhatsapp;
    if (!rawPhone) return null;

    let cleaned = rawPhone.toString().replace(/[\s\-\(\)]/g, '');

    if (cleaned.startsWith('0')) {
      cleaned = '241' + cleaned.substring(1);
    }

    if (!cleaned.startsWith('241') && !cleaned.startsWith('+')) {
      cleaned = '241' + cleaned;
    }

    return cleaned;
  };

  const phoneNumber = extractPhoneNumber();
  const whatsappLink = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Bonjour, je suis intéressé par votre annonce "${product.title}" sur GabonShop.`)}`
    : null;

  return (
    <Box sx={{ bgcolor: '#f5f7f9', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Box sx={{ py: 2 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.85rem' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Accueil</Link>
            <Link to="/products" style={{ textDecoration: 'none', color: 'inherit' }}>Produits</Link>
            <Typography color="text.primary" sx={{ fontSize: 'inherit' }}>{product.category || 'Détails'}</Typography>
          </Breadcrumbs>
        </Box>

        <Grid container spacing={4}>
          {/* Colonne principale - Images et Description */}
          <Grid item xs={12} md={8}>
            {/* En-tête du produit */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'white', mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight="900" component="h1" gutterBottom>
                    {product.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                      icon={<LocationIcon />}
                      label={product.location || 'Gabon'}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={formatDate(product.createdAt)}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<PersonIcon />}
                      label={product.ownerName || 'Vendeur'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Prix affiché ici pour mobile */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
                <Typography variant="h3" fontWeight="900" color="primary">
                  {formatPrice(product.price)}
                </Typography>
              </Box>
            </Paper>

            {/* Galerie d'images */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'white', mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  bgcolor: '#f8f9fa',
                  mb: 2,
                  position: 'relative',
                  pt: '75%',
                  cursor: 'zoom-in',
                  '&:hover .zoom-icon': { opacity: 1 }
                }}
                onClick={() => setImageDialogOpen(true)}
              >
                <CardMedia
                  component="img"
                  image={mainImage}
                  sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                />
                <Box
                  className="zoom-icon"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    borderRadius: 1,
                    p: 1,
                    opacity: 0,
                    transition: '0.3s'
                  }}
                >
                  <ZoomInIcon />
                </Box>
              </Card>

              {allImages.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
                  {allImages.map((img, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setMainImage(img)}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: mainImage === img ? '3px solid' : '1px solid',
                        borderColor: mainImage === img ? 'primary.main' : 'divider',
                        flexShrink: 0,
                        transition: '0.2s',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    >
                      <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>

            {/* Description */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', lineHeight: 1.8 }}>
                {product.description}
              </Typography>
            </Paper>
          </Grid>

          {/* Sidebar - Prix et Contact */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
              {/* Carte Prix et Contact */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 3, border: '2px solid', borderColor: 'primary.main', bgcolor: 'white' }}>
                <Typography variant="h3" fontWeight="900" color="primary" sx={{ mb: 1 }}>
                  {formatPrice(product.price)}
                </Typography>
                <Chip label="Particulier" size="small" color="primary" variant="outlined" sx={{ mb: 4 }} />

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={!whatsappLink}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                    }
                  }}
                >
                  {whatsappLink ? 'Contacter le vendeur' : 'Numéro non disponible'}
                </Button>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Publié par
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {product.ownerName || 'Vendeur'}
                  </Typography>
                </Box>
              </Paper>

              {/* Conseils de sécurité */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#fff3cd', border: '1px solid #ffc107' }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  💡 Conseils de sécurité
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  • Rencontrez le vendeur dans un lieu public<br />
                  • Vérifiez l'article avant de payer<br />
                  • Ne payez jamais à l'avance
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" fontWeight="900" sx={{ mb: 4 }}>
              Produits similaires
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.map(p => (
                <Grid item xs={12} sm={6} md={3} key={p.id}>
                  <Card
                    component={Link}
                    to={`/products/${p.id}`}
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textDecoration: 'none',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.08)',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', pt: '75%' }}>
                      <CardMedia
                        component="img"
                        image={getSafeImageUrl(getAllProductImages(p)[0])}
                        sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>
                        {p.title}
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="900">
                        {formatPrice(p.price)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Dialog pour voir l'image en grand */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <IconButton
          onClick={() => setImageDialogOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
          <img
            src={mainImage}
            alt={product.title}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductDetailPage;

