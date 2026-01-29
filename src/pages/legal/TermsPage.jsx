import { Container, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const TermsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Conditions d'utilisation
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Ces règles encadrent l’utilisation de GabonShop. En créant un compte, vous les acceptez.
        </Typography>

        <List disablePadding>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h6">Annonces conformes</Typography>}
              secondary="Publiez uniquement des produits légaux et conformes aux lois gabonaises."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h6">Exactitude des informations</Typography>}
              secondary="Fournissez des descriptions, prix et coordonnées exacts afin de garantir des échanges fiables."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h6">Respect et sécurité</Typography>}
              secondary="Aucun contenu haineux, frauduleux ou trompeur. Les annonces non conformes peuvent être retirées."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h6">Données personnelles</Typography>}
              secondary="Nous utilisons vos coordonnées pour faciliter les mises en relation (voir Politique de confidentialité)."
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default TermsPage;

