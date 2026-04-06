import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { user, setShowLogin } = useAuth();
  const { cartItems, cartTotal, totalDeliveryCharge, totalHandlingFee, updateQuantity, removeFromCart } = useCart();
  const grandTotal = cartTotal + totalDeliveryCharge + totalHandlingFee;

   if (!user) {
    return (
      <div className="cart-page">
        <div className="cart-page-card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🛒</div>
          <h2>My Cart</h2>
          <p className="info-muted" style={{ marginBottom: "2rem" }}>Login to view your cart items.</p>
          <button className="btn-primary" onClick={() => setShowLogin(true)}>Login to Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <h2>My Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-page-card">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p className="info-muted">Add items from the store to get started.</p>
          <Link to="/" className="btn-primary">Browse products</Link>
        </div>
      ) : (
        <>
          <div className="cart-page-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-page-item">
                <img src={item.imageURL} alt={item.name} className="cart-item-img" loading="lazy" />
                <div className="cart-page-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-unit">{item.unit}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="cart-page-remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-page-summary">
            <div className="bill-details">
              <h4>Bill details</h4>
              <div className="bill-row">
                <span>Items total</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="bill-row">
                <span>Delivery charge</span>
                <span>₹{totalDeliveryCharge}</span>
              </div>
              <div className="bill-row">
                <span>Handling fee</span>
                <span>₹{totalHandlingFee}</span>
              </div>
              <div className="bill-row bill-total">
                <span>Grand total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
            <button className="btn-primary btn-full" onClick={() => navigate("/checkout")}>
              Proceed to checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

