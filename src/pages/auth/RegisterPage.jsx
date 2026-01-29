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
    Grid,
    CircularProgress
} from "@mui/material";
import { Person, Email, Phone, Lock } from "@mui/icons-material";

const RegisterPage = () => {
    const { registerUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            return setError("Les mots de passe ne correspondent pas");
        }

        if (formData.password.length < 6) {
            return setError("Le mot de passe doit contenir au moins 6 caractères");
        }

        setLoading(true);

        try {
            await registerUser({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                role: "user" // Default role
            });
            navigate("/my-products"); // Redirect to the user products page
        } catch (err) {
            console.error(err);
            setError("Échec de l'inscription. L'email est peut-être déjà utilisé.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 4,
                    marginBottom: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography component="h1" variant="h4" gutterBottom fontWeight="bold">
                        Créer un compte
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Rejoignez la plus grande communauté d'achat du Gabon
                    </Typography>
                </Box>

                <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <form onSubmit={handleRegister}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    name="name"
                                    label="Nom complet"
                                    placeholder="Jean Dupont"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    type="email"
                                    name="email"
                                    label="Adresse Email"
                                    placeholder="exemple@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    type="tel"
                                    name="phone"
                                    label="Numéro de téléphone"
                                    placeholder="+241 07 00 00 00"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    type="password"
                                    name="password"
                                    label="Mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    type="password"
                                    name="confirmPassword"
                                    label="Confirmer"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
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
                                    sx={{ mt: 1, py: 1.5, fontSize: '1.1rem' }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
                                </Button>
                            </Box>
                        </form>
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Vous avez déjà un compte ?{' '}
                                <Link component={RouterLink} to="/login" variant="body2">
                                    Se connecter
                                </Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default RegisterPage;