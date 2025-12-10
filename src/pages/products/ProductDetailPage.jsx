import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductsContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { products, deleteProduct } = useProducts();

  const product = useMemo(
    () => products.find((p) => p.id === id),
    [products, id]
  );

  // -----------------------------
  // 🔥 FONCTION UNIVERSELLE : récupère l'image sous n'importe quel format
  // -----------------------------
  const getProductImage = (product) => {
    if (!product) return null;

    // Cas 1 : images = ["url"]
    if (Array.isArray(product.images) && typeof product.images[0] === "string") {
      return product.images[0];
    }

    // Cas 2 : images = [{ url: "url" }]
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

  // -----------------------------
  // 🔥 FONCTION : corrige les groupes Uploadcare (~xxxx)
  // -----------------------------
  const getSafeImageUrl = (url) => {
    if (!url) return null;

    // Déjà une vraie image
    if (url.includes("/nth/")) return url;

    // C’est un groupe (commence par ~)
    if (url.includes("~")) {
      return url.replace(/\/$/, "") + "/nth/0/";
    }

    return url;
  };

  // -----------------------------
  // 🔥 Construire l'image principale propre
  // -----------------------------
  const mainImage = getSafeImageUrl(getProductImage(product));

  // -----------------------------
  // SI PRODUIT INTROUVABLE
  // -----------------------------
  if (!product) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Produit introuvable
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ce produit n'existe pas ou a été supprimé.
          </Typography>
          <Button component={Link} to="/" variant="contained">
            Retour à l'accueil
          </Button>
        </Paper>
      </Container>
    );
  }

  const isOwner = currentUser && product && product.ownerId === currentUser.id;

  const handleDelete = () => {
    if (!product) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(product.id);
      navigate('/my-products');
    }
  };

  const formatPrice = (price) => {
    if (!price) return null;

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
  console.log(product.ownerPhone);
  console.log(product.ownerName);

  const whatsappLink = product?.ownerPhone
    ? `https://wa.me/${product.ownerPhone}?text=${encodeURIComponent(
        `Bonjour, je suis intéressé par votre produit : "${product.title}".`
      )}`
    : null;

  return (
    
    <Container maxWidth="lg">

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mt: 2, mb: 2 }}
      >
        Retour
      </Button>

      <Grid container spacing={4}>

        {/* ------------------------ */}
        {/* IMAGE DU PRODUIT */}
        {/* ------------------------ */}
        <Grid item xs={12} md={6}>
          <Card>

            {mainImage ? (
              <CardMedia
                component="img"
                src={mainImage}
                alt={product.title}
                sx={{ width: '100%', height: 'auto' }}
              />
            ) : (
              <Box
                sx={{
                  height: 400,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Pas d'image disponible
                </Typography>
              </Box>
            )}

          </Card>
        </Grid>

        {/* ------------------------ */}
        {/* DETAILS PRODUIT */}
        {/* ------------------------ */}
        <Grid item xs={12} md={6}>
          <Box>

            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>

            {product.price && (
              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
                {formatPrice(product.price)}
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            {/* INFO VENDEUR */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar>{product.ownerName?.charAt(0) || '?'}</Avatar>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.ownerName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Publié le {formatDate(product.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* DESCRIPTION */}
            <Typography variant="h6" gutterBottom>
              Description 
            </Typography>

            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {product.description}
            </Typography>

            {/* BOUTON CONTACTER SUR WHATSAPP */}
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 2, mb: 2 }}
              fullWidth
              href={whatsappLink || undefined}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!whatsappLink}
            >
              {whatsappLink ? 'Contacter sur WhatsApp' : 'Numéro WhatsApp non renseigné'}
            </Button>

          </Box>
        </Grid>

      </Grid>
    </Container>
 
  );
  
};

export default ProductDetailPage;
