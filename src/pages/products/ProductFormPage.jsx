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
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../contexts/ProductsContext";

const defaultForm = {
  title: "",
  description: "",
  price: "",
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

  useEffect(() => {
    if (isEditMode && productToEdit) {
      setFormData({
        title: productToEdit.title,
        description: productToEdit.description,
        price: productToEdit.price ? productToEdit.price.toString() : "",
        images: productToEdit.images || [],
      });
    }
  }, [isEditMode, productToEdit]);

  // --- UPLOADCARE V3 100% COMPATIBLE ---
  const handleOpenUploader = () => {
    if (!window.uploadcare) {
      alert("Uploadcare n'a pas chargé !");
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!formData.title || !formData.description) {
      setError("Le titre et la description sont obligatoires.");
      return;
    }

    if (formData.images.length === 0) {
      setError("Vous devez ajouter au moins une image.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: formData.price ? Number(formData.price) : null,
      images: formData.images,
    };

    if (isEditMode) {
      updateProduct(productId, payload, currentUser.id);
    } else {
      addProduct(payload, currentUser);
    }

    navigate("/my-products");
  };

  if (!currentUser) {
    return (
      <Container maxWidth="sm">
        <Alert severity="info">
          Vous devez être connecté pour {isEditMode ? "modifier" : "ajouter"} un
          produit.
        </Alert>
      </Container>
    );
  }

  if (isEditMode && !productToEdit) {
    return (
      <Container maxWidth="sm">
        <Alert severity="warning">Produit introuvable.</Alert>
      </Container>
    );
  }

  if (isEditMode && productToEdit.ownerId !== currentUser.id) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">Vous ne pouvez modifier que vos produits.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pb: 6 }}>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? "Modifier" : "Ajouter"} un produit
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Ajoutez un produit avec au moins une image.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Titre"
            value={formData.title}
            onChange={(e) =>
              setFormData((p) => ({ ...p, title: e.target.value }))
            }
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Description (Si possible, ajoutez le numéro par lequel vous pouvez être contacté)"
            value={formData.description}
            onChange={(e) =>
              setFormData((p) => ({ ...p, description: e.target.value }))
            }
            required
            fullWidth
            multiline
            minRows={4}
            margin="normal"
          />

          <TextField
            label="Prix"
            value={formData.price}
            onChange={(e) =>
              setFormData((p) => ({ ...p, price: e.target.value }))
            }
            type="number"
            fullWidth
            margin="normal"
          />

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleOpenUploader}
          >
            Ajouter des images
          </Button>

          {formData.images.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
              {formData.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  width="100"
                  height="100"
                  style={{
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained" fullWidth>
              {isEditMode ? "Mettre à jour" : "Publier"}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate(isEditMode ? "/my-products" : "/")}
            >
              Annuler
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductFormPage;
