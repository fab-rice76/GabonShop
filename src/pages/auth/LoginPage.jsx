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
import { Login as LoginIcon, ShieldOutlined } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext.jsx";

const LoginPage = () => {
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(email, password);
      alert("Connexion réussie !");
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
                onSubmit={handleLogin}
                sx={{
                  p: { xs: 3, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                <Box>
                  <Typography variant="overline" color="primary">
                    Connexion
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    Ravi de vous revoir
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accédez à votre compte en quelques secondes.
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" variant="outlined">
                    {error}
                  </Alert>
                )}

                <Stack spacing={2}>
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
                    placeholder="Votre mot de passe"
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
                  startIcon={<LoginIcon />}
                  sx={{ borderRadius: 2, py: 1.3 }}
                  fullWidth
                >
                  Se connecter
                </Button>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Nouveau sur GabonShop ?
                  </Typography>
                  <Link component={RouterLink} to="/register" underline="hover">
                    Créer un compte
                  </Link>
                </Stack>
              </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
