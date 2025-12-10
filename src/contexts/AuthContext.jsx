import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // --- Création de compte + Firestore ---
  const registerUser = async ({ email, password, name, phone }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Enregistrer dans Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      phone,
      email,
      createdAt: new Date(),
    });

    return cred;
  };

  // --- Login ---
  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // --- Logout ---
  const logoutUser = () => signOut(auth);

  // --- Surveille l’état Auth ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        return;
      }

      // Charger info Firestore
              const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        setCurrentUser({
          id: firebaseUser.uid,   // <- NECESSAIRE
          uid: firebaseUser.uid,
          ...snap.data(),
        });

    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
