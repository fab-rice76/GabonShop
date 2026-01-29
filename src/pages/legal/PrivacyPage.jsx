import { Container, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const PrivacyPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Politique de confidentialité
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Nous expliquons ici quelles données nous collectons et comment elles sont utilisées.
        </Typography>

        <List disablePadding>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h6">Données collectées</Typography>}
              secondary="Nom, email, numéro WhatsApp et contenus de vos annonces pour faciliter la mise en relation."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h6">Usage</Typography>}
              secondary="Affichage des annonces, contact via WhatsApp, notifications liées à votre activité."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h6">Conservation</Typography>}
              secondary="Nous conservons vos données tant que votre compte est actif ou que la loi l'exige."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h6">Vos droits</Typography>}
              secondary="Vous pouvez demander la mise à jour ou la suppression de vos données en nous contactant."
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default PrivacyPage;

