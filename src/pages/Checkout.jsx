import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createOrder } from "../services/orderService";
import { updateUserProfile } from "../services/userService";

const Checkout = () => {
  const { cartItems, cartTotal, totalDeliveryCharge, totalHandlingFee, clearCart, setCartOpen } = useCart();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online"); // online or cod
  const [address, setAddress] = useState({
    street: userProfile?.address?.street || "",
    city: userProfile?.address?.city || "",
    pincode: userProfile?.address?.pincode || "",
    state: userProfile?.address?.state || "",
    phone: userProfile?.address?.phone || "",
  });

  const codCharge = paymentMethod === "cod" ? 10 : 0;
  const grandTotal = cartTotal + totalDeliveryCharge + totalHandlingFee + codCharge;

  useEffect(() => {
    if (cartItems.length === 0) navigate("/");
    setCartOpen(false); // Close drawer if open
  }, [cartItems.length, navigate, setCartOpen]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!address.street || !address.city || !address.pincode || !address.phone) {
      showToast("Please fill all required address/phone fields", "error");
      return;
    }

    setLoading(true);

    if (paymentMethod === "cod") {
      // Direct Order Placement for Cash on Delivery
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems,
        total: grandTotal,
        paymentId: "Cash on Delivery",
        address,
      };
      
      try {
        const orderId = await createOrder(orderData);
        await updateUserProfile(user.uid, { address }); // Save address for future
        await clearCart();
        navigate(`/order-success?id=${orderId}`);
      } catch (error) {
        setLoading(false);
        showToast("Order creation failed, please contact support", "error");
      }
      return;
    }

    // Razorpay Flow
    const res = await loadRazorpay();
    if (!res) {
      showToast("Razorpay SDK failed to load. Are you online?", "error");
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY", // Will add to .env
      amount: grandTotal * 100, // Amount in paise
      currency: "INR",
      name: "QuickMart",
      description: "Grocery Delivery",
      image: "https://example.com/your_logo.png", // Optional
      handler: async function (response) {
        // Payment successful
        const orderData = {
          userId: user.uid,
          userEmail: user.email,
          items: cartItems,
          total: grandTotal,
          paymentId: response.razorpay_payment_id,
          address,
        };

        try {
          const orderId = await createOrder(orderData);
          await updateUserProfile(user.uid, { address }); // Save address for future
          await clearCart();
          navigate(`/order-success?id=${orderId}`);
        } catch (error) {
          console.error(error);
          showToast("Order creation failed, please contact support", "error");
        }
      },
      prefill: {
        name: userProfile?.displayName || user.email,
        email: user.email,
        contact: "9999999999", // Can be dynamic
      },
      notes: { address: address.street },
      theme: { color: "#0c831f" },
      modal: {
        ondismiss: function() {
          setLoading(false);
          showToast("Payment cancelled", "error");
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
        <h2>Checkout</h2>
      </div>

      <div className="checkout-content">
        {/* Step 1: Address form */}
        <div className="checkout-address-section">
          <div className="checkout-card">
            <h3>1. Delivery Address</h3>
            <div className="address-form-grid">
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  className="form-input"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="House No, Building, Street"
                />
              </div>
              <div className="form-group row-group">
                <div>
                  <label>City *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div>
                  <label>Pincode *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group row-group">
                <div>
                  <label>State *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  />
                </div>
                <div>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method (Moved from bottom) */}
          <div className="checkout-payment-section" style={{ marginTop: "2rem" }}>
            <div className="checkout-card">
              <h3>2. Payment Method</h3>
              <div className="payment-options" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', flex: 1, background: paymentMethod === 'online' ? 'var(--primary-light)' : 'var(--surface)', borderColor: paymentMethod === 'online' ? 'var(--primary)' : 'var(--border-color)' }}>
                  <input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} style={{ accentColor: 'var(--primary)' }} />
                  <strong>Pay Online via UPI/Card</strong>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', flex: 1, background: paymentMethod === 'cod' ? 'var(--primary-light)' : 'var(--surface)', borderColor: paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-color)' }}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} style={{ accentColor: 'var(--primary)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong>Cash on Delivery (COD)</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Additional ₹10 fee applies</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Bill Details / Summary */}
        <div className="checkout-summary-section">
          <div className="checkout-card summary-card">
            <h3>3. Order Summary</h3>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="summary-qty">{item.quantity} ×</span>
                    <span className="summary-name">{item.name}</span>
                  </div>
                  <span className="summary-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div className="bill-details">
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
              {paymentMethod === "cod" && (
                <div className="bill-row" style={{ color: "var(--danger)" }}>
                  <span>COD Charge</span>
                  <span>+ ₹{codCharge}</span>
                </div>
              )}
              <div className="bill-row bill-total">
                <span>Grand total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              className="btn-primary btn-full checkout-pay-btn"
              onClick={handlePayment}
              disabled={loading}
              style={{ marginTop: "1rem" }}
            >
              {loading ? <span className="spinner" /> : paymentMethod === "cod" ? `Place Order ₹${grandTotal}` : `Pay ₹${grandTotal}`}
            </button>
            <p className="secure-payment-note" style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {paymentMethod === "cod" ? "Pay with cash directly to the delivery runner" : "🔒 Safe and secure payments by Razorpay"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
