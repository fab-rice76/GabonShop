import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { AdminProvider } from './contexts/AdminContext';
import theme from './theme/theme';

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
import AdminDashboard from './pages/admin/AdminDashboardPage'; // Assuming accurate file name from previous list_dir

// Legal / Help Pages
import HowItWorksPage from './pages/legal/HowItWorksPage';
import FaqPage from './pages/legal/FaqPage';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProductsProvider>
          <AdminProvider>
            <Router>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'background.default'
              }}>
                <Header />
                <Box component="main" sx={{
                  flexGrow: 1,
                  py: 4,
                  px: 2,
                  width: '100%',
                  maxWidth: '1280px',
                  mx: 'auto'
                }}>
                  <Routes>
                    {/* Pages publiques */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />

                    {/* Pages d'aide et légales */}
                    <Route path="/help/comment-ca-marche" element={<HowItWorksPage />} />
                    <Route path="/help/faq" element={<FaqPage />} />
                    <Route path="/legal/conditions" element={<TermsPage />} />
                    <Route path="/legal/confidentialite" element={<PrivacyPage />} />

                    {/* Pages d'authentification */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes (To be wrapped in PrivateRoute later) */}
                    <Route path="/products/new" element={<ProductFormPage />} />
                    <Route path="/products/:productId/edit" element={<ProductFormPage />} />
                    <Route path="/my-products" element={<MyProductsPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </Box>
                <Footer />
              </Box>
            </Router>
          </AdminProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
