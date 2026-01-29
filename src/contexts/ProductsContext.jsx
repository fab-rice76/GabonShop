import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";

const ProductsContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (data, owner) => {
    const docRef = await addDoc(collection(db, "products"), {
      ...data,
      ownerId: owner.id,
      ownerName: owner.name || owner.email,
      ownerPhone: owner.phone || owner.whatsapp || owner.phoneNumber || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await loadProducts();
    return docRef.id;
  };

  const updateProduct = async (id, updates) => {
    await updateDoc(doc(db, "products", id), {
      ...updates,
      updatedAt: Date.now(),
    });

    await loadProducts();
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    await loadProducts();
  };

  const getProductsByOwner = (ownerId) => {
    return products.filter((p) => p.ownerId === ownerId);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByOwner,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
