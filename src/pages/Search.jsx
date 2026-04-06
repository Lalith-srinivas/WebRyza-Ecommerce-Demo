import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeleton";
import Footer from "../components/Footer";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    const run = async () => {
      setLoading(true);
      const res = await searchProducts(query);
      setResults(res);
      setLoading(false);
    };
    run();
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h2>
          {query ? (
            <>Search results for "<strong>{query}</strong>"</>
          ) : (
            "Search Products"
          )}
        </h2>
        {!loading && query && (
          <p className="results-count">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
        )}
      </div>

      {loading ? (
        <div className="products-grid">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : results.length === 0 && query ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No results for "{query}"</h3>
          <p>Try different keywords or browse our categories.</p>
          <Link to="/" className="btn-primary">Browse All</Link>
        </div>
      ) : (
        <div className="products-grid">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Search;
