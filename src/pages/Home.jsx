import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import CategorySidebar from "../components/CategorySidebar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import MobileHome from "../components/MobileHome";
import { ProductCardSkeleton } from "../components/Skeleton";
import { getProducts, getCategories, seedCategories, seedSampleProducts } from "../services/productService";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await seedCategories();
      await seedSampleProducts();
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    };
    init();
  }, []);

  // Group products by category
  const grouped = categories.reduce((acc, cat) => {
    const items = products.filter((p) => p.category === cat.name);
    if (items.length > 0) acc[cat.name] = { category: cat, items };
    return acc;
  }, {});

  // Also add any categories from products not in the seeded list
  products.forEach((p) => {
    if (!grouped[p.category]) {
      grouped[p.category] = { category: { name: p.category, slug: p.category }, items: [p] };
    } else if (!grouped[p.category].items.includes(p)) {
      // already added
    }
  });

  return (
    <div className="home-layout">
      {/* Category Sidebar */}
      <CategorySidebar categories={categories} activeSlug={null} />

      {/* Main Content */}
      <main className="home-main">
        {/* Banner (Desktop) */}
        <div className="desktop-only">
          <Banner />
        </div>

        {/* Category Chips Row (Desktop) */}
        <section className="category-chips-section desktop-only">
          <div className="category-chips">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="category-chip"
                onClick={() => navigate(`/category/${cat.slug}`)}
              >
                {cat.imageURL ? <img src={cat.imageURL} alt={cat.name} loading="lazy" /> : <span style={{fontSize:'2rem'}}>📦</span>}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Product Sections by Category (Desktop) */}
        <div className="desktop-only">
          {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          Object.entries(grouped).map(([catName, { category, items }]) => (
            <section key={catName} className="product-section">
              <div className="section-header">
                <div className="section-title-group">
                  <h2 className="section-title">{catName}</h2>
                  <p className="section-subtitle">{items.length} items</p>
                </div>
                <Link to={`/category/${category.slug}`} className="see-all-link">
                  See all →
                </Link>
              </div>
              <div className="products-row">
                {items.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))
        )}
        </div>

        {/* Mobile View Output */}
        {!loading && <MobileHome grouped={grouped} products={products} categories={categories} />}

        <Footer />
      </main>
    </div>
  );
};

export default Home;
