import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, setShowLogin } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: "🏠", color: "#0c831f" },
    { name: "Category", path: "/categories", icon: "📑", color: "#5d3fd3" },
    { name: "Orders", path: "/account?tab=orders", icon: "📦", color: "#f5a623" },
    { name: "Profile", path: "/account", icon: "👤", color: "#1a73e8" },
  ];

  return (
    <div className="mobile-only mobile-bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.name}
          className={`nav-btn ${
            location.pathname === item.path
              ? "active"
              : ""
          }`}
          onClick={() => {
            if (!user && (item.path.includes("/account") || item.path.includes("tab=orders"))) {
              setShowLogin(true);
            } else {
              navigate(item.path);
            }
          }}
          style={{ color: location.pathname === item.path ? item.color : "var(--text-muted)" }}
        >
          <span className="nav-icon">
            {item.icon}
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </span>
          <span className="nav-text">{item.name}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileBottomNav;
