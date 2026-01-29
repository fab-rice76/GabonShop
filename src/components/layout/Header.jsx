import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  PlaylistAdd as AddIcon,
  Inventory2 as ItemsIcon,
  ExitToApp as LogoutIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();
  const isLoggedIn = currentUser !== null;

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logoutUser();
    handleMenuClose();
    navigate('/');
  };

  const navigationLinks = [
    { label: 'Rechercher', path: '/products', icon: <SearchIcon fontSize="small" /> },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          width: '100%'
        }}
      >
        <Toolbar
          sx={{
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            gap: { xs: 1, md: 3 },
            px: { xs: 2, md: 3 }
          }}
        >
          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            Gabon<Box component="span" sx={{ color: '#FCD116' }}>Shop</Box>
          </Typography>

          {/* Bouton Desktop: Déposer une annonce */}
          <Button
            component={Link}
            to="/products/new"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              borderRadius: 2,
              px: 2,
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(0, 158, 96, 0.2)' }
            }}
          >
            Déposer une annonce
          </Button>

          {/* Barre de recherche desktop (plus discrète) */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              maxWidth: 400,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Que recherchez-vous ?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: '#f4f6f7',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
              }}
            />
          </Box>

          {/* Accès compte / Menu Desktop */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isLoggedIn ? (
              <>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                      bgcolor: 'primary.main',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {(currentUser?.name?.[0] || currentUser?.email?.[0] || '?').toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: { mt: 1.5, minWidth: 200, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {currentUser?.name || 'Utilisateur'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {currentUser?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem component={Link} to="/my-products" onClick={handleMenuClose}>
                    <ItemsIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                    Mes annonces
                  </MenuItem>
                  {currentUser?.role === 'admin' && (
                    <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                      <DashboardIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                      Administration
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
                    <Typography color="error">Se déconnecter</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  Se connecter
                </Button>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, my: 'auto' }} />
                <Button
                  component={Link}
                  to="/register"
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  S'inscrire
                </Button>
              </Box>
            )}

            {/* Menu Mobile */}
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer Mobile */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Box sx={{ width: 280, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Menu</Typography>

          <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
            <ListItem
              button
              component={Link}
              to="/products/new"
              onClick={() => setMobileMenuOpen(false)}
              sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 2, mb: 1 }}
            >
              <AddIcon sx={{ mr: 2 }} />
              <ListItemText primary="Déposer une annonce" primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>

            <ListItem button component={Link} to="/" onClick={() => setMobileMenuOpen(false)} sx={{ borderRadius: 2 }}>
              <HomeIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText primary="Accueil" />
            </ListItem>

            <ListItem button component={Link} to="/products" onClick={() => setMobileMenuOpen(false)} sx={{ borderRadius: 2 }}>
              <SearchIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText primary="Rechercher" />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            {!isLoggedIn ? (
              <>
                <ListItem button component={Link} to="/login" onClick={() => setMobileMenuOpen(false)} sx={{ borderRadius: 2 }}>
                  <ListItemText primary="Se connecter" />
                </ListItem>
                <ListItem button component={Link} to="/register" onClick={() => setMobileMenuOpen(false)} sx={{ borderRadius: 2 }}>
                  <ListItemText primary="Créer un compte" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/my-products" onClick={() => setMobileMenuOpen(false)} sx={{ borderRadius: 2 }}>
                  <ItemsIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText primary="Mes annonces" />
                </ListItem>
                <ListItem button onClick={handleLogout} sx={{ borderRadius: 2 }}>
                  <LogoutIcon sx={{ mr: 2, color: 'error.main' }} />
                  <ListItemText primary="Déconnexion" primaryTypographyProps={{ color: 'error' }} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
