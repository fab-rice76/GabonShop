import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate("/my-products"); // Redirect to a protected page after login
    } catch (err) {
      console.error(err);
      setError("Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Bon retour
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connectez-vous pour gérer votre boutique
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                type="email"
                label="Adresse Email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                type={showPassword ? "text" : "password"}
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ mt: 1, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Pas encore de compte ?{' '}
              <Link component={RouterLink} to="/register" fontWeight="600" underline="hover">
                Créer un compte
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
