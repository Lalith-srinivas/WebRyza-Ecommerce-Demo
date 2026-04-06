import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for shopping with QuickMart.</p>
        {orderId && (
          <div className="order-reference">
            <p>Order Reference ID:</p>
            <strong>{orderId}</strong>
          </div>
        )}
        <p className="delivery-estimate">Your order will be delivered to your doorstep in about 10 minutes.</p>

        <div className="success-actions">
          <Link to="/account?tab=orders" className="btn-outline">View Order</Link>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
