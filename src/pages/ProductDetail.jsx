import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getProductById, getProductsByCategory } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const cartItem = cartItems.find((i) => i.id === id);
  const qty = cartItem?.quantity || 0;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const p = await getProductById(id);
      setProduct(p);
      if (p) {
        const rel = await getProductsByCategory(p.category);
        setRelated(rel.filter((r) => r.id !== id).slice(0, 6));
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAdd = async () => {
    if (!user) { showToast("Please login to add to cart", "error"); return; }
    setAdding(true);
    await addToCart(product);
    showToast(`${product.name} added to cart! 🛒`);
    setAdding(false);
  };

  const discount = product && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  if (loading) return (
    <div className="product-detail-skeleton">
      <div className="skeleton skeleton-detail-img" />
      <div className="skeleton-detail-info">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line medium" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="empty-state">
      <div className="empty-icon">🔍</div>
      <h3>Product not found</h3>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  );

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>›</span>
        <Link to={`/category/${product.category}`}>{product.category}</Link> <span>›</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail-layout">
        {/* Image */}
        <div className="product-detail-img-wrap">
          {discount > 0 && <span className="detail-discount-badge">{discount}% OFF</span>}
          <img src={product.imageURL} alt={product.name} className="product-detail-img" />
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <div className="detail-delivery-badge">⏱ 10 MINS</div>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-unit">{product.unit}</p>

          <div className="detail-price-row">
            <span className="detail-price">₹{product.price}</span>
            {discount > 0 && (
              <>
                <span className="detail-mrp">₹{product.mrp}</span>
                <span className="detail-discount-tag">{discount}% off</span>
              </>
            )}
          </div>

          <p className="detail-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} left)</span>
            ) : (
              <span className="out-stock">✕ Out of Stock</span>
            )}
          </p>

          {/* Cart Control */}
          <div className="detail-cart-section">
            {qty === 0 ? (
              <button className="btn-detail-add" onClick={handleAdd} disabled={adding || product.stock === 0}>
                {adding ? <span className="spinner" /> : "Add to Cart 🛒"}
              </button>
            ) : (
              <div className="detail-qty-control">
                <button onClick={() => qty <= 1 ? removeFromCart(product.id) : updateQuantity(product.id, qty - 1)}>−</button>
                <span>{qty}</span>
                <button onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
              </div>
            )}
            <button className="btn-buy-now" onClick={() => { handleAdd(); navigate("/checkout"); }}>
              Buy Now
            </button>
          </div>

          {/* Description */}
          <div className="detail-description">
            <h3>About this product</h3>
            <p>{product.description}</p>
          </div>

          {/* Product Details Table */}
          <div className="detail-specs">
            <h3>Product Details</h3>
            <table>
              <tbody>
                <tr><td>Category</td><td>{product.category}</td></tr>
                <tr><td>Net Quantity</td><td>{product.unit}</td></tr>
                <tr><td>Price</td><td>₹{product.price}</td></tr>
                {product.mrp !== product.price && <tr><td>MRP</td><td>₹{product.mrp}</td></tr>}
                <tr><td>Stock</td><td>{product.stock} units</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="product-section">
          <div className="section-header">
            <h2 className="section-title">You might also like</h2>
          </div>
          <div className="products-row">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
