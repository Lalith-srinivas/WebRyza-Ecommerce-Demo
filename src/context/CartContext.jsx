import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }
    const cartRef = collection(db, "cart", user.uid, "items");
    const unsub = onSnapshot(cartRef, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCartItems(items);
    });
    return unsub;
  }, [user]);

  const addToCart = useCallback(
    async (product, qty = 1) => {
      if (!user) return false;
      const itemRef = doc(db, "cart", user.uid, "items", product.id);
      const existing = cartItems.find((i) => i.id === product.id);
      if (existing) {
        await setDoc(itemRef, { ...existing, quantity: existing.quantity + qty }, { merge: true });
      } else {
        await setDoc(itemRef, {
          productId: product.id,
          name: product.name,
          price: product.price,
          mrp: product.mrp || product.price,
          imageURL: product.imageURL,
          quantity: qty,
          unit: product.unit || "",
          deliveryCharge: product.deliveryCharge || 0,
          handlingFee: product.handlingFee || 0,
          addedAt: serverTimestamp(),
        });
      }
      return true;
    },
    [user, cartItems]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      if (!user) return;
      await deleteDoc(doc(db, "cart", user.uid, "items", productId));
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (productId, qty) => {
      if (!user) return;
      if (qty <= 0) { await removeFromCart(productId); return; }
      await setDoc(doc(db, "cart", user.uid, "items", productId), { quantity: qty }, { merge: true });
    },
    [user, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    if (!user) return;
    const cartRef = collection(db, "cart", user.uid, "items");
    const snap = await getDocs(cartRef);
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  }, [user]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalDeliveryCharge = cartItems.reduce((sum, i) => sum + (i.deliveryCharge || 0) * i.quantity, 0);
  const totalHandlingFee = cartItems.reduce((sum, i) => sum + (i.handlingFee || 0) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        totalDeliveryCharge,
        totalHandlingFee,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
