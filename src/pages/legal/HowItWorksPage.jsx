import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from "@mui/material";

const steps = [
  { title: "1. Créez votre compte", body: "Inscrivez-vous avec votre email et votre numéro WhatsApp pour être joignable rapidement." },
  { title: "2. Publiez vos produits", body: "Ajoutez des photos, un prix clair et une description concise. Les acheteurs vous contactent directement." },
  { title: "3. Échangez en direct", body: "Le bouton WhatsApp permet aux acheteurs de vous joindre instantanément pour finaliser la vente." },
  { title: "4. Gérez vos annonces", body: "Modifiez ou supprimez vos produits depuis l’espace Mes produits." },
];

const HowItWorksPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Comment ça marche ?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Voici les étapes simples pour publier et vendre sur GabonShop.
        </Typography>

        <List disablePadding>
          {steps.map((item) => (
            <ListItem key={item.title} sx={{ alignItems: "flex-start", pb: 2 }}>
              <ListItemText
                primary={
                  <Typography variant="h6" fontWeight={700}>
                    {item.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" color="text.secondary">
                    {item.body}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Astuce : pour maximiser vos ventes, utilisez des photos nettes, un prix réaliste et répondez rapidement aux messages.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default HowItWorksPage;

