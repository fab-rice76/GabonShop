import { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Inventory as InventoryIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const DashboardLayout = ({ children, title }) => {
    const { currentUser, logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Mes Produits', icon: <InventoryIcon />, path: '/my-products' },
        // Add more user items here
    ];

    if (currentUser?.role === 'admin') {
        menuItems.unshift({ text: 'Administration', icon: <DashboardIcon />, path: '/admin' });
    }

    const drawer = (
        <div>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    GabonShop
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ px: 2, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText',
                                    },
                                    '&:hover': {
                                        bgcolor: 'primary.main',
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'inherit' : 'text.secondary' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 'auto', p: 2 }}>
                {/* Footer or extra info in drawer */}
            </Box>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1
                }}
                elevation={0}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {title || 'Tableau de bord'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handleMenuOpen} size="small">
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                {currentUser?.name?.charAt(0) || 'U'}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem disabled>
                                <Typography variant="body2">{currentUser?.email}</Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Déconnexion
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: '4px 0 20px rgba(0,0,0,0.02)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
