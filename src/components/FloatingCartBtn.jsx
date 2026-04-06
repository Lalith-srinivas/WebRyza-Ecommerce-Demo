import React from "react";
import { useCart } from "../context/CartContext";

const FloatingCartBtn = () => {
  const { cartItems, cartTotal, setCartOpen } = useCart();

  // If cart is empty, don't show the floating button
  if (cartItems.length === 0) return null;

  return (
    <div className="mobile-only floating-cart-btn" onClick={() => setCartOpen(true)}>
      <div className="fc-left">
        <span className="fc-icon">🛒</span>
        <div className="fc-details">
          <span className="fc-items">{cartItems.length} item{cartItems.length > 1 ? "s" : ""}</span>
          <span className="fc-price">₹{cartTotal}</span>
        </div>
      </div>
      <div className="fc-right">
        <span>View cart</span>
        <span className="fc-arrow">›</span>
      </div>
    </div>
  );
};

export default FloatingCartBtn;
