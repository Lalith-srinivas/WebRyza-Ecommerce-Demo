import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const banners = [
  {
    id: 1,
    title: "Stock up on daily essentials",
    subtitle: "Get farm-fresh goodness & a range of exotic fruits, vegetables, eggs & more",
    cta: "Shop Now",
    bg: "linear-gradient(135deg, #0c831f 0%, #1ba548 50%, #0a6e1a 100%)",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80",
    category: "fruits-vegetables",
  },
  {
    id: 2,
    title: "Pharmacy at your doorstep!",
    subtitle: "Cough syrups, pain relief sprays & more",
    cta: "Order Now",
    bg: "linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80",
    category: "pharmacy",
  },
  {
    id: 3,
    title: "Snacks & Munchies",
    subtitle: "Chips, namkeen & more - delivered in minutes",
    cta: "Explore",
    bg: "linear-gradient(135deg, #e65100 0%, #bf360c 100%)",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80",
    category: "snacks-munchies",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const b = banners[current];

  return (
    <div className="banner-section">
      {/* Main Hero Banner */}
      <div className="hero-banner" style={{ background: b.bg }} onClick={() => navigate(`/category/${b.category}`)}>
        <div className="hero-content">
          <h1 className="hero-title">{b.title}</h1>
          <p className="hero-subtitle">{b.subtitle}</p>
          <button className="hero-cta">{b.cta}</button>
        </div>
        <div className="hero-image">
          <img src={b.image} alt={b.title} loading="lazy" />
        </div>

        {/* Dots */}
        <div className="banner-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`banner-dot ${i === current ? "active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            />
          ))}
        </div>
      </div>

      {/* Mini Banners Row */}
      <div className="mini-banners">
        <div className="mini-banner mini-blue" onClick={() => navigate("/category/pharmacy")}>
          <div className="mini-banner-text">
            <strong>Pharmacy at your doorstep!</strong>
            <span>Cough syrups, pain relief sprays & more</span>
            <button>Order Now</button>
          </div>
          <span className="mini-banner-emoji">💊</span>
        </div>
        <div className="mini-banner mini-orange" onClick={() => navigate("/category/baby-care")}>
          <div className="mini-banner-text">
            <strong>Pet care supplies at your door</strong>
            <span>Food, toys, accessories & more</span>
            <button>Shop Now</button>
          </div>
          <span className="mini-banner-emoji">🐾</span>
        </div>
        <div className="mini-banner mini-purple" onClick={() => navigate("/category/household")}>
          <div className="mini-banner-text">
            <strong>No time for a diaper run?</strong>
            <span>Baby care essentials delivered in minutes</span>
            <button>Explore</button>
          </div>
          <span className="mini-banner-emoji">👶</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
