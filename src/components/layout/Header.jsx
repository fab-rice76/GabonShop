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
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();

  // 👉 Ce que le AuthContext expose réellement
  const { currentUser, logoutUser } = useAuth();

  // 👉 Vérification d'authentification
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutUser();
    handleMenuClose();
    navigate('/');
  };

  const navigationLinks = [
    { label: 'Accueil', path: '/', icon: <HomeIcon fontSize="small" /> },
    { label: 'Produits', path: '/products', icon: <CategoryIcon fontSize="small" /> },
    ...(isLoggedIn
      ? [
          { label: 'Mes produits', path: '/my-products', icon: <ItemsIcon fontSize="small" /> },
        ]
      : []),
  ];

  return (
    <>
    
      <AppBar position="sticky" elevation={2} sx={{ width: '100%' }}>
        <Toolbar
          sx={{
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
              flexGrow: { xs: 1, sm: 0 },
              ml: 3,
            }}
          >
            GabonShop
          </Typography>

          {/* Barre de recherche desktop */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              maxWidth: 500,
              mx: 2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Menu Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navigationLinks.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}

            {isLoggedIn ? (
              <>
                <Button
                  color="inherit"
                  onClick={handleMenuOpen}
                  startIcon={
                    <Avatar sx={{ width: 24, height: 24 }}>
                       {(currentUser?.name?.[0] || currentUser?.email?.[0] || '?').toUpperCase()}
                    </Avatar>
                  }
                ></Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem component={Link} to="/my-products" onClick={handleMenuClose}>
                    Mes produits
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Déconnexion
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" color="inherit">
                  Connexion
                </Button>
                <Button component={Link} to="/register" variant="outlined" color="inherit">
                  Inscription
                </Button>
              </>
            )}
          </Box>

          {/* Menu Mobile */}
          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer Mobile */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <List>

            {/* Barre de recherche mobile */}
            <ListItem>
              <Box component="form" onSubmit={handleSearch} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </ListItem>

            <Divider />

            {navigationLinks.map((item) => (
              <ListItem
                button
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <ListItemText sx={{ ml: 2 }} primary={item.label} />
              </ListItem>
            ))}

            {isLoggedIn ? (
              <>
                <ListItem
                  button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogoutIcon fontSize="small" />
                  <ListItemText sx={{ ml: 2 }} primary="Déconnexion" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem
                  button
                  component={Link}
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Connexion" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Inscription" />
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
