import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const ProductCard = ({ product }) => {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);

  const cartItem = cartItems.find((i) => i.id === product.id);
  const qty = cartItem?.quantity || 0;
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login to add items to cart", "error");
      return;
    }
    setAdding(true);
    const success = await addToCart(product);
    if (success) showToast(`${product.name} added to cart! 🛒`);
    setAdding(false);
  };

  const handleIncrease = async (e) => {
    e.preventDefault();
    await updateQuantity(product.id, qty + 1);
  };

  const handleDecrease = async (e) => {
    e.preventDefault();
    if (qty <= 1) await removeFromCart(product.id);
    else await updateQuantity(product.id, qty - 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-img-wrap">
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
        <div className="delivery-time-badge">⏱ 10 MINS</div>
        <img
          src={product.imageURL}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
      </div>

      <div className="product-card-body">
        <p className="product-unit">{product.unit}</p>
        <h4 className="product-name">{product.name}</h4>

        <div className="product-price-row">
          <div className="product-prices">
            <span className="product-price">₹{product.price}</span>
            {discount > 0 && <span className="product-mrp">₹{product.mrp}</span>}
          </div>

          {qty === 0 ? (
            <button
              className={`btn-add ${adding ? "btn-adding" : ""}`}
              onClick={handleAdd}
              disabled={adding}
            >
              {adding ? "..." : "ADD"}
              {!adding && <span className="add-plus">+</span>}
            </button>
          ) : (
            <div className="qty-control-inline" onClick={(e) => e.preventDefault()}>
              <button className="qty-btn" onClick={handleDecrease}>−</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn qty-plus" onClick={handleIncrease}>+</button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
