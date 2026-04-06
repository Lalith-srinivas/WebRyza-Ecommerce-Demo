import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getOrdersByUser, updateOrderStatus } from "../services/orderService";
import { updateUserProfile } from "../services/userService";
import ConfirmModal from "../components/ConfirmModal";
import Footer from "../components/Footer";

const Account = () => {
  const { user, userProfile, logout, fetchUserProfile, isAdmin, setShowLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const [form, setForm] = useState({
    displayName: userProfile?.displayName || "",
    address: {
      street: userProfile?.address?.street || "",
      city: userProfile?.address?.city || "",
      pincode: userProfile?.address?.pincode || "",
      state: userProfile?.address?.state || "",
      phone: userProfile?.address?.phone || "",
    },
  });

  useEffect(() => {
    if (tab === "orders") {
      setOrdersLoading(true);
      getOrdersByUser(user.uid).then((o) => { setOrders(o); setOrdersLoading(false); });
    }
  }, [tab, user]);

  useEffect(() => {
    if (userProfile) {
      setForm({
        displayName: userProfile.displayName || "",
        address: {
          street: userProfile.address?.street || "",
          city: userProfile.address?.city || "",
          pincode: userProfile.address?.pincode || "",
          state: userProfile.address?.state || "",
          phone: userProfile.address?.phone || "",
        },
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    await updateUserProfile(user.uid, form);
    await fetchUserProfile(user.uid);
    showToast("Profile updated! ✓");
    setEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    showToast("Logged out successfully");
  };

  const handleCancelOrder = (orderId) => {
    setConfirmState({
      isOpen: true,
      title: "Cancel Order",
      message: "Are you sure you want to cancel this order? This cannot be undone.",
      onConfirm: async () => {
        setConfirmState({ ...confirmState, isOpen: false });
        try {
          await updateOrderStatus(orderId, "cancelled");
          showToast("Order cancelled successfully");
          // Refresh orders locally
          setOrders(orders.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o));
        } catch (error) {
          showToast("Failed to cancel order", "error");
        }
      }
    });
  };

  const statusColor = { confirmed: "#0c831f", pending: "#f5a623", delivered: "#1a73e8", cancelled: "#d32f2f" };

  if (!user) {
    return (
      <div className="account-page">
        <div className="account-container" style={{ justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div className="account-card" style={{ maxWidth: "400px", textAlign: "center", padding: "3rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>👤</div>
            <h2 style={{ marginBottom: "0.5rem" }}>My Account</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
              Login to view your profile, manage orders, and save addresses.
            </p>
            <button className="btn-primary btn-full" onClick={() => setShowLogin(true)}>
              Login / Sign Up
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="account-avatar-wrap">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="avatar" className="account-avatar" />
            ) : (
              <div className="account-avatar-placeholder">
                {(userProfile?.displayName || user?.email || "U")[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3>{userProfile?.displayName || "User"}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <nav className="account-nav">
            <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>
              👤 My Profile
            </button>
            <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
              📦 My Orders
            </button>
            <button className={tab === "addresses" ? "active" : ""} onClick={() => setTab("addresses")}>
              📍 Addresses
            </button>
            {/* Desktop-only admin entry point (mobile shows it below Address). */}
            {isAdmin && (
              <button className="desktop-only" onClick={() => navigate("/admin")}>
                ⚙️ Admin Panel
              </button>
            )}
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </nav>
        </aside>

        {/* Main */}
        <div className="account-main">
          {tab === "profile" && (
            <div className="account-card">
              <div className="account-card-header">
                <h2>My Profile</h2>
                <button className="btn-outline" onClick={() => setEditing((v) => !v)}>
                  {editing ? "Cancel" : "✏ Edit"}
                </button>
              </div>

              {editing ? (
                <div className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      className="form-input"
                      value={form.displayName}
                      onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input className="form-input" value={user?.email} disabled />
                  </div>
                  <button className="btn-primary" onClick={handleSave}>Save Changes</button>
                </div>
              ) : (
                <div className="profile-view">
                  <div className="profile-row"><span>Name</span><strong>{userProfile?.displayName || "—"}</strong></div>
                  <div className="profile-row"><span>Email</span><strong>{user?.email}</strong></div>
                  <div className="profile-row">
                    <span>Member since</span>
                    <strong>{userProfile?.createdAt?.toDate?.()?.toLocaleDateString() || "—"}</strong>
                  </div>
                </div>
              )}

              {/* Mobile-only Admin entry in Profile Tab */}
              {isAdmin && (
                <div className="mobile-only" style={{ marginTop: "1.5rem", padding: "1.25rem", background: "var(--primary-light)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--primary)" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--primary)", marginBottom: "0.8rem", fontWeight: "700" }}>System Administrator Access</p>
                  <button 
                    className="btn-primary btn-full" 
                    onClick={() => navigate("/admin")}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                  >
                    ⚙️ Open Admin Panel
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="account-card">
              <div className="account-card-header">
                <h2>My Address</h2>
                <button className="btn-outline" onClick={() => setEditing((v) => !v)}>
                  {editing ? "Cancel" : "✏ Edit"}
                </button>
              </div>
              {editing ? (
                <div className="profile-form">
                  {["street", "city", "pincode", "state", "phone"].map((field) => (
                    <div className="form-group" key={field}>
                      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        className="form-input"
                        value={form.address[field]}
                        onChange={(e) => setForm({ ...form, address: { ...form.address, [field]: e.target.value } })}
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" onClick={handleSave}>Save Address</button>
                </div>
              ) : (
                <div className="address-display">
                  {userProfile?.address?.street ? (
                    <div className="address-card">
                      <span className="address-icon">📍</span>
                      <div>
                        <p>{userProfile.address.street}</p>
                        <p>{userProfile.address.city}, {userProfile.address.state} - {userProfile.address.pincode}</p>
                        {userProfile.address.phone && <p style={{ marginTop: "0.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>📞 {userProfile.address.phone}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state small">
                      <p>No address saved. Click Edit to add one.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "orders" && (
            <div className="account-card">
              <h2>My Orders</h2>
              {ordersLoading ? (
                <div className="orders-loading">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-state small">
                  <div className="empty-icon">📦</div>
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here!</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-box" style={{ border: "1px solid var(--border-color)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1rem", background: "var(--surface)" }}>
                      
                      {/* Order Header */}
                      <div className="order-box-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                        <div>
                          <strong style={{ fontSize: "1.1rem" }}>Order #{order.id.slice(-8).toUpperCase()}</strong>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
                            {order.createdAt?.toDate?.()?.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }) || "Recent"}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <strong style={{ fontSize: "1.1rem" }}>₹{order.total}</strong>
                          <div style={{ marginTop: "0.5rem" }}>
                            <span 
                              style={{ 
                                padding: "0.3rem 0.8rem", 
                                borderRadius: "100px", 
                                fontSize: "0.8rem", 
                                fontWeight: "600",
                                background: ["pending", "confirmed", "processing"].includes(order.status) ? "#d6cdba" : order.status === "cancelled" ? "#ffcccc" : "#c3e6cb",
                                color: ["pending", "confirmed", "processing"].includes(order.status) ? "#5c4f3d" : order.status === "cancelled" ? "#cc0000" : "#155724"
                              }}
                            >
                              {order.status === "confirmed" ? "Processing" : order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Processing"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="order-box-items" style={{ borderTop: "1px solid var(--border-color)", borderBottom: order.status !== "cancelled" ? "1px solid var(--border-color)" : "none", padding: "1.5rem 0", marginBottom: order.status !== "cancelled" ? "1.5rem" : "0" }}>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: i !== order.items.length - 1 ? "1rem" : "0" }}>
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                              <img src={item.imageURL} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--surface-alt)" }} />
                              <div>
                                <div style={{ fontWeight: "500" }}>{item.name}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div style={{ fontWeight: "600" }}>
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions - Only allow cancellation for pending orders */}
                      {order.status === "pending" && (
                        <div className="order-box-actions" style={{ display: "flex", justifyContent: "flex-end" }}>
                           <button 
                             className="btn-outline" 
                             style={{ color: "var(--danger)", borderColor: "var(--danger)", padding: "0.4rem 1rem", fontSize: "0.9rem" }}
                             onClick={() => handleCancelOrder(order.id)}
                           >
                              Cancel Order
                           </button>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState({ ...confirmState, isOpen: false })}
      />
    </div>
  );
};

export default Account;
