import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  Tab,
  Tabs,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  WhatsApp as WhatsAppIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  TrendingUp,
  SupervisorAccount
} from "@mui/icons-material";

import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../contexts/ProductsContext";
import { useAdmin } from "../../contexts/AdminContext";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AdminDashboardPage = () => {
  const { currentUser, loading } = useAuth();
  const { products, loadProducts } = useProducts();
  const { users, loadUsers, deleteProductWithReason, deleteUserWithReason } = useAdmin();

  const [section, setSection] = useState("products");
  const [dialog, setDialog] = useState({ open: false, type: null, target: null, reason: "" });

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const productsList = useMemo(() => products || [], [products]);
  const usersList = useMemo(() => users || [], [users]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const openDialog = (type, target) => setDialog({ open: true, type, target, reason: "" });
  const closeDialog = () => setDialog({ open: false, type: null, target: null, reason: "" });

  // Fonction pour formater le numéro WhatsApp
  const formatWhatsAppNumber = (rawPhone) => {
    if (!rawPhone) return null;
    let cleaned = rawPhone.toString().replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '241' + cleaned.substring(1);
    }
    if (!cleaned.startsWith('241') && !cleaned.startsWith('+')) {
      cleaned = '241' + cleaned;
    }
    return cleaned;
  };

  const handleConfirm = async () => {
    if (!dialog.reason.trim()) return;
    if (dialog.type === "product") {
      await deleteProductWithReason(dialog.target.id || dialog.target, dialog.reason.trim(), currentUser.id);
      await loadProducts();
    }
    if (dialog.type === "user") {
      await deleteUserWithReason(dialog.target.id, dialog.reason.trim(), currentUser.id);
      await loadUsers();
    }
    closeDialog();
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography color="text.secondary" variant="overline" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.dark`, height: 56, width: 56 }}>
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Administration">
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Utilisateurs"
            value={usersList.length}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Articles Publiés"
            value={productsList.length}
            icon={<ArticleIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ventes (Simulées)"
            value="0 XAF"
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Admins"
            value={usersList.filter(u => u.role === 'admin').length}
            icon={<SupervisorAccount />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={section} onChange={(e, v) => setSection(v)} aria-label="admin tabs">
          <Tab icon={<ArticleIcon />} iconPosition="start" label="Gestion Articles" value="products" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Gestion Utilisateurs" value="users" />
        </Tabs>
      </Box>

      {section === "products" && (
        <Stack spacing={2}>
          {productsList.length === 0 ? (
            <Typography color="text.secondary">Aucun article à afficher.</Typography>
          ) : (
            productsList.map((p) => (
              <Card key={p.id} variant="outlined" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <CardContent sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: "center" }, gap: 2 }}>
                  <Avatar
                    variant="rounded"
                    src={p.images?.[0] || p.imageUrl}
                    sx={{ width: 64, height: 64 }}
                  >
                    <ArticleIcon />
                  </Avatar>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {p.title || "Sans titre"}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Par: {p.ownerName || "Inconnu"}
                      </Typography>
                      {p.price && (
                        <Chip size="small" label={`${p.price} XAF`} color="primary" variant="outlined" />
                      )}
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    {p.ownerPhone && (
                      <Tooltip title={`WhatsApp: ${p.ownerPhone}`}>
                        <IconButton 
                          color="success" 
                          href={`https://wa.me/${formatWhatsAppNumber(p.ownerPhone)}`} 
                          target="_blank"
                          component="a"
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Button
                      color="error"
                      variant="outlined"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => openDialog("product", p)}
                    >
                      Supprimer
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      )}

      {section === "users" && (
        <Stack spacing={2}>
          {usersList.length === 0 ? (
            <Typography color="text.secondary">Aucun utilisateur trouvé.</Typography>
          ) : (
            usersList.map((u) => (
              <Card key={u.id} variant="outlined">
                <CardContent sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: "center" }, gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {u.name?.charAt(0) || u.email?.charAt(0)}
                  </Avatar>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {u.name || "Utilisateur"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {u.email}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={0.5}>
                      <Chip size="small" label={u.role || "user"} color={u.role === 'admin' ? "warning" : "default"} />
                      {u.phone && <Chip size="small" icon={<WhatsAppIcon />} label={u.phone} variant="outlined" />}
                    </Stack>
                  </Box>

                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => openDialog("user", u)}
                    disabled={u.role === 'admin'}
                  >
                    Bannir
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      )}

      <Dialog open={dialog.open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Confirmation requise</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Veuillez indiquer la raison de cette suppression. Cette action est irréversible.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Motif de la suppression"
            placeholder="Ex : Contenu inapproprié, Arnaque..."
            fullWidth
            multiline
            rows={3}
            value={dialog.reason}
            onChange={(e) => setDialog((d) => ({ ...d, reason: e.target.value }))}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annuler</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            disabled={!dialog.reason.trim()}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;

