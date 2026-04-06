import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import Banner from "./Banner";

const MobileHome = ({ grouped, products = [], categories = [] }) => {
  const navigate = useNavigate();
  const items = (products.length ? products : Object.values(grouped).flatMap((g) => g.items)).slice(0, 12);

  return (
    <div className="mobile-only mobile-home-container">
      {/* Banner Section */}
      <section className="mobile-banner-section">
        <Banner />
      </section>

      {/* Horizontal Categories Scroll */}
      <section className="mobile-categories-section">
        <div className="section-header">
          <h2 className="section-title">Categories</h2>
        </div>
        <div className="mobile-category-scroll">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="mobile-category-item"
              onClick={() => navigate(`/category/${cat.slug}`)}
            >
              <div className="mobile-category-img-wrap">
                {cat.imageURL ? (
                  <img src={cat.imageURL} alt={cat.name} loading="lazy" />
                ) : (
                  <div className="mobile-category-placeholder">📦</div>
                )}
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mobile-products-block">
        <div className="mobile-products-title">Products</div>
        <div className="products-grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      <div style={{ height: "120px" }} />
    </div>
  );
};

export default MobileHome;
