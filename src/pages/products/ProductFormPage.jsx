import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Divider,
  IconButton,
  Chip,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../contexts/ProductsContext";

const categories = [
  'Véhicules', 'Immobilier', 'Informatique', 'Mode', 'Maison', 'Loisirs', 'Autres'
];

const locations = [
  'Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Mouila', 'Lambaréné', 'Makokou', 'Koumamoussou', 'Tchibanga', 'Autre'
];

const defaultForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  location: "",
  images: [],
};

const UPLOADCARE_PUBLIC_KEY = "64b02577201bb618ede6";

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  const { currentUser } = useAuth();
  const { products, addProduct, updateProduct } = useProducts();

  const productToEdit = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  );

  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && productToEdit) {
      setFormData({
        title: productToEdit.title || "",
        description: productToEdit.description || "",
        price: productToEdit.price ? productToEdit.price.toString() : "",
        category: productToEdit.category || "",
        location: productToEdit.location || "",
        images: productToEdit.images || [],
      });
    }
  }, [isEditMode, productToEdit]);

  const handleOpenUploader = () => {
    if (!window.uploadcare) {
      alert("Erreur: Le service d'images n'est pas prêt.");
      return;
    }

    window.uploadcare
      .openDialog(null, {
        publicKey: UPLOADCARE_PUBLIC_KEY,
        multiple: true,
        imagesOnly: true,
      })
      .done((fileGroup) => {
        fileGroup.promise().then((result) => {
          let urls = [];

          // CAS 1 : Un seul fichier
          if (result.cdnUrl && !result.files) {
            urls = [result.cdnUrl];
          }

          // CAS 2 : Groupe de plusieurs fichiers
          if (result.files && Array.isArray(result.files)) {
            urls = result.files.map((f) => f.cdnUrl).filter(Boolean);
          }

          if (urls.length === 0) {
            alert("Erreur : aucune image retournée.");
            return;
          }

          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...urls],
          }));
        });
      });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    if (formData.images.length === 0) {
      setError("Veuillez ajouter au moins une photo.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: formData.price ? Number(formData.price) : null,
      updatedAt: new Date().toISOString()
    };

    try {
      if (isEditMode) {
        await updateProduct(productId, payload, currentUser.id);
      } else {
        await addProduct(payload, currentUser);
      }
      navigate("/my-products");
    } catch (err) {
      console.error("Save error:", err);
      setError("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Alert severity="info" variant="outlined" sx={{ borderRadius: 3 }}>
          Vous devez être connecté pour publier une annonce.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f7f9', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="900" gutterBottom align="center">
          {isEditMode ? "Modifier votre annonce" : "Déposer une annonce"}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Plus votre annonce est détaillée, plus vous vendrez vite !
        </Typography>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Section Photos */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>Photos</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ajoutez jusqu'à 10 photos. La première sera la photo principale.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              {formData.images.map((url, i) => (
                <Box key={i} sx={{ position: 'relative', width: 120, height: 120 }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, border: '1px solid #ddd' }} />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(i)}
                    sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {i === 0 && <Chip label="Principale" size="small" color="primary" sx={{ position: 'absolute', bottom: 5, left: 5, fontSize: '0.6rem', height: 18 }} />}
                </Box>
              ))}
              {formData.images.length < 10 && (
                <Box
                  onClick={handleOpenUploader}
                  sx={{
                    width: 120, height: 120, borderRadius: 3, border: '2px dashed', borderColor: 'divider',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: '#f0f2f5', borderColor: 'primary.main' }
                  }}
                >
                  <UploadIcon color="action" />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>Ajouter</Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Section Informations */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>Informations générales</Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Titre de l'annonce" variant="outlined" required
                  value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: iPhone 13 Pro 128Go"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth select label="Catégorie" required
                  value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                >
                  {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth select label="Localisation" required
                  value={formData.location} onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                >
                  {locations.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth multiline rows={6} label="Description" required
                  placeholder="Décrivez votre article avec précision..."
                  value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Prix (XAF)" type="number"
                  placeholder="Laissez vide pour 'Prix à débattre'"
                  value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 6, display: 'flex', gap: 2 }}>
              <Button
                type="submit" variant="contained" color="primary" fullWidth size="large" disabled={loading}
                sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 'bold' }}
              >
                {loading ? "En cours..." : (isEditMode ? "Enregistrer les modifications" : "Publier l'annonce")}
              </Button>
              <Button
                variant="outlined" fullWidth size="large" onClick={() => navigate(-1)}
                sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 'bold' }}
              >
                Annuler
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductFormPage;
