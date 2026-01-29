import React, { createContext, useContext, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const AdminContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loadUsers = async () => {
    setLoadingUsers(true);
    const snap = await getDocs(collection(db, "users"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setUsers(list);
    setLoadingUsers(false);
    return list;
  };

  const logModeration = (payload) =>
    addDoc(collection(db, "moderationLogs"), {
      createdAt: Date.now(),
      ...payload,
    });

  const deleteProductWithReason = async (product, reason, adminId) => {
    await logModeration({
      type: "product",
      targetId: product.id,
      targetOwnerId: product.ownerId,
      targetTitle: product.title,
      reason,
      adminId,
    });
    await deleteDoc(doc(db, "products", product.id));
  };

  const deleteUserWithReason = async (userId, reason, adminId) => {
    await logModeration({
      type: "user",
      targetId: userId,
      targetOwnerId: userId,
      reason,
      adminId,
    });
    await deleteDoc(doc(db, "users", userId));
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        loadingUsers,
        loadUsers,
        deleteProductWithReason,
        deleteUserWithReason,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

