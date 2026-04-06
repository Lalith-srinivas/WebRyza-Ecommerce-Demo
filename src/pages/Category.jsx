import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CategorySidebar from "../components/CategorySidebar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { ProductCardSkeleton } from "../components/Skeleton";
import { getProductsByCategory, getCategories } from "../services/productService";

const Category = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState(1000);

  const activeCategory = categories.find((c) => c.slug === slug);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const cats = await getCategories();
      setCategories(cats);
      const cat = cats.find((c) => c.slug === slug);
      if (cat) {
        const prods = await getProductsByCategory(cat.name);
        setProducts(prods);
      } else {
        setProducts([]);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const sorted = [...products]
    .filter((p) => p.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="home-layout">
      <CategorySidebar categories={categories} activeSlug={slug} />

      <main className="home-main">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>{activeCategory?.name || slug}</span>
        </div>

        <div className="category-page">
          {/* Filters Row */}
          <div className="filter-bar">
            <h2 className="category-page-title">
              {activeCategory?.name || "Products"}
            </h2>
            <div className="filter-controls">
              <div className="filter-group">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Max Price: ₹{maxPrice}</label>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or browse other categories.</p>
              <Link to="/" className="btn-primary">Go Home</Link>
            </div>
          ) : (
            <>
              <p className="results-count">{sorted.length} product{sorted.length !== 1 ? "s" : ""} found</p>
              <div className="products-grid">
                {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Category;
