import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PersonAddAlt as PersonAddIcon, EmojiEvents } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const RegisterPage = () => {
  const { registerUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Le nom complet est obligatoire");

    try {
      await registerUser({ email, password, name, phone });
      alert("Compte créé avec succès !");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md" sx={{ width: "100%", py: { xs: 4, md: 6 } }}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
              <Box
                component="form"
                onSubmit={handleRegister}
                sx={{
                  p: { xs: 3, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                <Box>
                  <Typography variant="overline" color="primary">
                    Inscription
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    Démarrez votre aventure
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quelques informations suffisent pour créer votre compte.
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" variant="outlined">
                    {error}
                  </Alert>
                )}

                <Stack spacing={2}>
                  <TextField
                    type="text"
                    label="Nom complet"
                    placeholder="Nom et prénom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                  />

                  <TextField
                    type="text"
                    label="Numéro de téléphone"
                    placeholder="+241 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    type="email"
                    label="Adresse e-mail"
                    placeholder="exemple@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                  />

                  <TextField
                    type="password"
                    label="Mot de passe"
                    placeholder="Au moins 6 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                  />
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddIcon />}
                  sx={{ borderRadius: 2, py: 1.3 }}
                  fullWidth
                >
                  Créer mon compte
                </Button>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Vous avez déjà un compte ?
                  </Typography>
                  <Link component={RouterLink} to="/login" underline="hover">
                    Se connecter
                  </Link>
                </Stack>
              </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
