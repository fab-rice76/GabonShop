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
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Création de compte + Firestore ---
  const registerUser = async ({ email, password, name, phone, role }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Enregistrer dans Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      name: name?.trim() || "",
      phone: phone?.trim() || "",
      role: role?.trim() || "user",
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
      try {
        if (!firebaseUser) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        // Charger info Firestore
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        const data = snap.data() || {};
        setCurrentUser({
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || firebaseUser.email,
          phone: data.phone || data.whatsapp || "",
          email: data.email || firebaseUser.email,
          role: data.role || "user",
          ...data,
        });
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
