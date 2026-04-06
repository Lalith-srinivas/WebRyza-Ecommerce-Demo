import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span>🛒</span> <strong>QuickMart</strong>
          </div>
          <p>India's fastest grocery delivery app. Fresh products at your doorstep in minutes.</p>
          <div className="footer-social">
            {/* Intent: prevent broken "#" links; wire to real routes later */}
            <a href="https://example.com" target="_blank" rel="noreferrer" aria-label="Facebook">📘</a>
            <a href="https://example.com" target="_blank" rel="noreferrer" aria-label="Twitter">🐦</a>
            <a href="https://example.com" target="_blank" rel="noreferrer" aria-label="Instagram">📸</a>
            <a href="https://example.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        <div className="footer-col">
          <h5>Useful Links</h5>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/press">Press</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Categories</h5>
          <ul>
            <li><Link to="/category/fruits-vegetables">Vegetables & Fruits</Link></li>
            <li><Link to="/category/dairy-bread">Dairy & Bread</Link></li>
            <li><Link to="/category/snacks-munchies">Snacks & Munchies</Link></li>
            <li><Link to="/category/cold-drinks-juices">Cold Drinks & Juices</Link></li>
            <li><Link to="/category/personal-care">Personal Care</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Get the App</h5>
          <div className="app-badges">
            {/* Intent: keep UI intact; replace with real store links later */}
            <a href="https://example.com" target="_blank" rel="noreferrer" className="app-badge">
              <span>🍎</span> App Store
            </a>
            <a href="https://example.com" target="_blank" rel="noreferrer" className="app-badge">
              <span>▶</span> Google Play
            </a>
          </div>
          <p className="footer-contact">📞 1800-000-MART</p>
          <p className="footer-contact">✉ support@quickmart.in</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 QuickMart Commerce Private Limited • All Rights Reserved</p>
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
