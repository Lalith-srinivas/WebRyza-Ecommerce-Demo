import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const CartDrawer = () => {
  const { cartItems, cartTotal, totalDeliveryCharge, totalHandlingFee, cartOpen, setCartOpen, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tip, setTip] = useState(0);

  const grandTotal = cartTotal + totalDeliveryCharge + totalHandlingFee + tip;

  const handleProceed = () => {
    if (!user) { showToast("Please login to proceed", "error"); return; }
    if (cartItems.length === 0) { showToast("Your cart is empty", "error"); return; }
    setCartOpen(false);
    navigate("/checkout");
  };

  if (!cartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-header">
          <button className="cart-back" onClick={() => setCartOpen(false)}>←</button>
          <h2>My Cart</h2>
          <button className="cart-share">↗ Share</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add items from the store to get started</p>
            <button className="btn-primary" onClick={() => setCartOpen(false)}>Browse Products</button>
          </div>
        ) : (
          <div className="cart-body">
            {/* Delivery Info */}
            <div className="cart-delivery-info">
              <div className="delivery-badge">
                <span className="delivery-clock">🕐</span>
                <div>
                  <strong>Delivery in 10 minutes</strong>
                  <p>Shipment of {cartItems.length} item{cartItems.length > 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.imageURL} alt={item.name} className="cart-item-img" loading="lazy" />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-unit">{item.unit}</p>
                    <p className="cart-item-price">₹{item.price}</p>
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn qty-plus" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="bill-details">
              <h4>Bill details</h4>
              <div className="bill-row">
                <span>🧾 Items total</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="bill-row">
                <span>🚴 Delivery charge</span>
                <span>₹{totalDeliveryCharge}</span>
              </div>
              <div className="bill-row">
                <span>🛍 Handling fee</span>
                <span>₹{totalHandlingFee}</span>
              </div>
              {tip > 0 && (
                <div className="bill-row">
                  <span>❤️ Delivery partner tip</span>
                  <span>₹{tip}</span>
                </div>
              )}
              <div className="bill-row bill-total">
                <span>Grand total 🎯</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Tip Section */}
            <div className="tip-section">
              <p className="tip-title">Tip your delivery partner</p>
              <p className="tip-desc">Your kindness means a lot! 100% of your tip goes directly to them. 💚</p>
              <div className="tip-buttons">
                {[20, 30, 50].map((t) => (
                  <button
                    key={t}
                    className={`tip-btn ${tip === t ? "active" : ""}`}
                    onClick={() => setTip(tip === t ? 0 : t)}
                  >
                    😊 ₹{t}
                  </button>
                ))}
                <button
                  className={`tip-btn ${tip > 0 && ![20, 30, 50].includes(tip) ? "active" : ""}`}
                  onClick={() => { const v = prompt("Enter custom tip amount:"); if (v && !isNaN(v)) setTip(parseInt(v)); }}
                >
                  Custom
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Proceed Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-footer-total">
              <span className="footer-amount">₹{grandTotal}</span>
              <span className="footer-label">TOTAL</span>
            </div>
            <button className="btn-proceed" onClick={handleProceed}>
              Proceed →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
