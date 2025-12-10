import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/homepage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductFormPage from './pages/products/ProductFormPage';
import ProductListPage from './pages/products/ProductListPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import MyProductsPage from './pages/profile/MyProductsPage';

// Theme personnalisé pour le Gabon
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Vert pour représenter la nature du Gabon
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF6F00', // Orange pour l'énergie et la chaleur
      light: '#FF8F00',
      dark: '#E65100',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <ProductsProvider>
          <Router>
            <div className="App" style={{ 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '100vh',
              alignItems: 'center'
            }}>
              <Header />
              <main style={{ 
                minHeight: 'calc(100vh - 140px)', 
                paddingTop: '20px',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Routes>
                  {/* Pages publiques */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductListPage />} />
                  <Route path="/products/new" element={<ProductFormPage />} />
                  <Route path="/products/:productId/edit" element={<ProductFormPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  
                  {/* Pages d'authentification */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Gestion personnelle */}
                  <Route path="/my-products" element={<MyProductsPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ProductsProvider>
    </ThemeProvider>
  );
}

export default App;
