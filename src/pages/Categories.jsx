import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/productService";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const cats = await getCategories();
      setCategories(cats);
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h2>Categories</h2>
      </div>

      {loading ? (
        <div className="spinner-large" style={{ margin: "2rem auto" }} />
      ) : (
        <div className="categories-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="category-tile"
              onClick={() => navigate(`/category/${cat.slug}`)}
            >
              {cat.imageURL ? (
                <img src={cat.imageURL} alt={cat.name} loading="lazy" />
              ) : (
                <div className="category-tile-fallback">📦</div>
              )}
              <div className="category-tile-name">{cat.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

