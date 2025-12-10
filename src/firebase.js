// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ---- CONFIGURATION CORRIGÉE ----
// Important : le storageBucket doit rester en .appspot.com
// même si Firebase affiche .firebasestorage.app dans l’interface !
const firebaseConfig = {
  apiKey: "AIzaSyBagOyM5SjXpPTBXQMtxRVO1QGjRch7HIw",
  authDomain: "gabonshop-af5a6.firebaseapp.com",
  projectId: "gabonshop-af5a6",
  storageBucket: "gabonshop-af5a6.appspot.com", // ← ESSENTIEL (sinon erreur 400 CONFIGURATION_NOT_FOUND)
  messagingSenderId: "747613975016",
  appId: "1:747613975016:web:eda3826526c475b3fc345d",
};

// Initialisation
const app = initializeApp(firebaseConfig);

// Export des services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
