import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    q: "Comment publier un produit ?",
    a: "Créez un compte, rendez-vous sur Mes produits puis cliquez sur Ajouter un produit. Ajoutez un titre, une description, des photos et un prix.",
  },
  {
    q: "Comment les acheteurs me contactent ?",
    a: "Nous affichons un bouton WhatsApp sur vos annonces avec le numéro enregistré dans votre compte. Vérifiez que votre numéro WhatsApp est bien renseigné.",
  },
  {
    q: "Puis-je modifier ou supprimer une annonce ?",
    a: "Oui, allez dans Mes produits, sélectionnez l'annonce et choisissez Modifier ou Supprimer.",
  },
  {
    q: "Quel type de produits sont autorisés ?",
    a: "Seuls les produits légaux au Gabon. Les contenus interdits ou dangereux seront retirés.",
  },
];

const FaqPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Foire aux questions (FAQ)
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Les réponses aux questions les plus fréquentes sur GabonShop.
        </Typography>

        {faqs.map((item) => (
          <Accordion key={item.q} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight={700}>
                {item.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {item.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  );
};

export default FaqPage;

