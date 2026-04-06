import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const { user, userProfile, logout, isAdmin, showLogin, setShowLogin } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const isHome = location.pathname === "/";
  const isInner = location.pathname !== "/";

  useEffect(() => {
    document.body.classList.toggle("has-mobile-topbar", true);
    return () => document.body.classList.remove("has-mobile-topbar");
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleCartClick = () => {
    if (!user) { setShowLogin(true); return; }
    // On mobile we use full Cart page. Desktop keeps the drawer.
    if (window.matchMedia?.("(max-width: 768px)")?.matches) {
      navigate("/cart");
      return;
    }
    setCartOpen(true);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar desktop-only">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">QuickMart</span>
          </Link>

          {/* Delivery Location */}
          <div className="navbar-location">
            <span className="location-icon">📍</span>
            <div className="location-text">
              <span className="delivery-label">Delivery in 10 minutes</span>
              <span className="delivery-address">Hyderabad, TS ▾</span>
            </div>
          </div>

          {/* Search Bar */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder='Search "bread"'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>

          {/* Right Actions */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* Login / User */}
            {user ? (
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button className="user-btn" onClick={() => setShowUserMenu((v) => !v)}>
                  <div className="user-avatar">
                    {userProfile?.photoURL ? (
                      <img src={userProfile.photoURL} alt="avatar" />
                    ) : (
                      <span>{(userProfile?.displayName || user.email || "U")[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className="user-name">{userProfile?.displayName?.split(" ")[0] || "Account"}</span>
                  <span>▾</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link to="/account" onClick={() => setShowUserMenu(false)}>👤 My Account</Link>
                    <Link to="/account?tab=orders" onClick={() => setShowUserMenu(false)}>📦 My Orders</Link>
                    {isAdmin && <Link to="/admin" onClick={() => setShowUserMenu(false)}>⚙️ Admin Panel</Link>}
                    <button onClick={() => { logout(); setShowUserMenu(false); }}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                Login
              </button>
            )}

            {/* Cart */}
            <button className="cart-btn" onClick={handleCartClick}>
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              <span className="cart-label">
                {cartCount > 0 ? `₹${cartCount} item${cartCount > 1 ? "s" : ""}` : "My Cart"}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen((v) => !v)}>
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="mobile-search-bar">
          {/* We handle mobile search inside the new mobile header instead */}
        </div>
      </nav>

      {/* New Mobile Topbar (built from scratch) */}
      <div className="mobile-only mobile-topbar">
        <div className="mobile-topbar-row">
          <div className="mobile-topbar-left">
            {isInner && (
              <button className="mobile-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                ←
              </button>
            )}
            <div className="mobile-store">
              <div className="mobile-store-name">QuickMart</div>
              <button className="mobile-location" type="button">
                Hyderabad, TS ▾
              </button>
            </div>
          </div>

          <div className="mobile-topbar-actions" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" style={{ background: "var(--surface-alt)", borderRadius: "var(--radius-md)", width: "44px", height: "44px", display: "grid", placeItems: "center" }}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            
            {user ? (
              <Link to="/account" className="mobile-user-btn" style={{ background: "var(--surface-alt)", borderRadius: "var(--radius-md)", width: "44px", height: "44px", display: "grid", placeItems: "center", textDecoration: "none" }}>
                <span style={{ fontSize: "1.2rem" }}>👤</span>
              </Link>
            ) : (
              <button className="login-btn-mobile" onClick={() => setShowLogin(true)} style={{ background: "var(--primary)", color: "white", padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", fontWeight: "600", fontSize: "0.9rem", border: "none" }}>
                Login
              </button>
            )}

            <button className="mobile-cart-btn" onClick={handleCartClick} aria-label="Open cart">
              🛒
              {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        <form className="mobile-topbar-search" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder='Search products'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      {/* Spacer removed - padding is handled by the main content layout */}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
