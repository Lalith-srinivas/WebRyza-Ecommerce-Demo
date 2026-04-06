import React from "react";
import { useNavigate } from "react-router-dom";

const CategorySidebar = ({ categories, activeSlug }) => {
  const navigate = useNavigate();

  return (
    <aside className="category-sidebar">
      <div className="category-sidebar-inner">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-sidebar-item ${activeSlug === cat.slug ? "active" : ""}`}
            onClick={() => navigate(`/category/${cat.slug}`)}
          >
            <div className="cat-sidebar-img-wrap">
              {cat.imageURL ? (
                <img
                  src={cat.imageURL}
                  alt={cat.name}
                  className="cat-sidebar-img"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '📦'; }}
                />
              ) : (
                <span>📦</span>
              )}
            </div>
            <span className="cat-sidebar-name">{cat.name || "Category"}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default CategorySidebar;
