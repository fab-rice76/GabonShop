# GabonShop - Marketplace du Gabon 🇬🇦

Plateforme de petites annonces moderne pour le Gabon. Achetez et vendez facilement : véhicules, immobilier, électronique, mode et plus encore.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Firebase

### Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd gabonshop

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# Puis éditer .env avec vos clés Firebase

# Lancer en développement
npm run dev
```

### Variables d'Environnement

Créez un fichier `.env` à la racine avec :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_projet_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_UPLOADCARE_PUBLIC_KEY=votre_uploadcare_key
```

## 📦 Build Production

```bash
# Créer le build optimisé
npm run build

# Prévisualiser le build
npm run preview
```

## 🔥 Configuration Firebase

### 1. Règles Firestore
Déployez les règles de sécurité :
```bash
firebase deploy --only firestore:rules
```

### 2. Règles Storage
Déployez les règles de stockage :
```bash
firebase deploy --only storage
```

## 🌐 Déploiement

### Vercel (Recommandé)
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

### Firebase Hosting
```bash
firebase init hosting
firebase deploy --only hosting
```

## 🛠️ Technologies

- **Frontend**: React 19, Material-UI, React Router
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Build**: Vite
- **Upload**: Uploadcare

## 📱 Fonctionnalités

- ✅ Authentification (inscription/connexion)
- ✅ Publication d'annonces avec photos
- ✅ Recherche et filtres par catégorie
- ✅ Contact vendeurs via WhatsApp
- ✅ Gestion de profil et annonces
- ✅ Dashboard administrateur
- ✅ Design responsive et moderne

## 🔐 Sécurité

- Variables d'environnement pour les clés sensibles
- Règles de sécurité Firestore et Storage
- Validation côté client et serveur
- Protection CSRF automatique

## 📄 Licence

Propriétaire - Tous droits réservés

## 👥 Support

Pour toute question : contact@gabonshop.ga
