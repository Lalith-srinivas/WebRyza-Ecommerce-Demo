import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories, addProduct, updateProduct, deleteProduct } from "../services/productService";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../services/orderService";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import Footer from "../components/Footer";

const Admin = () => {
  const [tab, setTab] = useState("dashboard"); // dashboard, products, orders
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  // Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", mrp: "", category: "", imageURL: "", stock: "", unit: "", featured: false,
    deliveryCharge: 0, handlingFee: 0
  });

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    if (tab === "products" || tab === "dashboard") {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p);
      setCategories(c);
      if (categories.length > 0 && !productForm.category) {
        setProductForm((prev) => ({ ...prev, category: c[0].name }));
      }
    }
    if (tab === "orders" || tab === "dashboard") {
      const o = await getAllOrders();
      setOrders(o);
    }
    setLoading(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...productForm,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        stock: Number(productForm.stock),
        deliveryCharge: Number(productForm.deliveryCharge || 0),
        handlingFee: Number(productForm.handlingFee || 0),
      };

      if (editProductId) {
        await updateProduct(editProductId, formattedData);
        showToast("Product updated successfully");
      } else {
        await addProduct(formattedData);
        showToast("Product added successfully");
      }
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      showToast("Error saving product", "error");
    }
  };

  const openAddProduct = () => {
    setEditProductId(null);
    setProductForm({
      name: "", description: "", price: "", mrp: "", category: categories[0]?.name || "", imageURL: "", stock: "", unit: "", featured: false,
      deliveryCharge: 0, handlingFee: 0
    });
    setShowProductModal(true);
  };

  const openEditProduct = (prod) => {
    setEditProductId(prod.id);
    setProductForm({ ...prod });
    setShowProductModal(true);
  };

  const handleDeleteProduct = (id) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      onConfirm: async () => {
        setConfirmState({ ...confirmState, isOpen: false });
        await deleteProduct(id);
        showToast("Product deleted");
        fetchData();
      }
    });
  };

  const handleDeleteOrder = (id) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Order",
      message: "Are you sure you want to permanently delete this cancelled order?",
      onConfirm: async () => {
        setConfirmState({ ...confirmState, isOpen: false });
        await deleteOrder(id);
        showToast("Order deleted successfully");
        fetchData();
      }
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast("Order status updated");
      fetchData();
    } catch (error) {
       showToast("Failed to update status", "error");
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "cancelled" ? o.total : 0), 0);

  return (
    <div className="admin-page">
       <div className="admin-sidebar">
          <div className="admin-logo">
             🛒 <span>Admin Panel</span>
          </div>
          <nav className="admin-nav">
             <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>📊 Dashboard</button>
             <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>📦 Products</button>
             <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>🧾 Orders</button>
          </nav>
          <div className="admin-back-link">
              <Link to="/">← Back to Store</Link>
          </div>
       </div>

       <div className="admin-main">
          <div className="admin-header">
             <h2>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h2>
             <div className="admin-user">Admin User</div>
          </div>

          <div className="admin-content">
             {loading && <div className="spinner-large" style={{ margin: "2rem auto" }} />}

             {!loading && tab === "dashboard" && (
                <div>
                   <div className="dashboard-stats">
                      <div className="stat-card">
                         <h3>Total Revenue</h3>
                         <p className="stat-value">₹{totalRevenue}</p>
                      </div>
                      <div className="stat-card">
                         <h3>Total Orders</h3>
                         <p className="stat-value">{orders.length}</p>
                      </div>
                      <div className="stat-card">
                         <h3>Total Products</h3>
                         <p className="stat-value">{products.length}</p>
                      </div>
                   </div>
                   
                   <div className="dashboard-grid">
                      <div className="admin-card">
                         <h3>Recent Orders</h3>
                         <div className="admin-table-wrap">
                            <table className="admin-table">
                               <thead><tr><th>Order ID</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                               <tbody>
                                  {orders.slice(0, 5).map(o => (
                                     <tr key={o.id}>
                                       <td>{o.id.slice(-6)}</td>
                                       <td>{o.createdAt?.toDate().toLocaleDateString()}</td>
                                       <td>₹{o.total}</td>
                                       <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {!loading && tab === "products" && (
                <div className="admin-card">
                   <div className="admin-card-header">
                      <h3>Manage Products</h3>
                      <button className="btn-primary" onClick={openAddProduct}>+ Add Product</button>
                   </div>
                   <div className="admin-table-wrap">
                      <table className="admin-table">
                         <thead>
                            <tr>
                               <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
                            </tr>
                         </thead>
                         <tbody>
                            {products.map(p => (
                               <tr key={p.id}>
                                  <td><img src={p.imageURL} alt={p.name} style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius:"4px" }} /></td>
                                  <td>{p.name}</td>
                                  <td>{p.category}</td>
                                  <td>₹{p.price}</td>
                                  <td>{p.stock}</td>
                                  <td>
                                     <button className="btn-icon" onClick={() => openEditProduct(p)}>✏️</button>
                                     <button className="btn-icon text-danger" onClick={() => handleDeleteProduct(p.id)}>🗑️</button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}

             {!loading && tab === "orders" && (
                <div className="admin-card">
                   <h3>All Orders</h3>
                   <div className="admin-table-wrap">
                      <table className="admin-table">
                         <thead>
                            <tr>
                              <th style={{ width: '15%' }}>Order Info</th>
                              <th style={{ width: '30%' }}>Customer Details</th>
                              <th style={{ width: '35%' }}>Items Ordered</th>
                              <th style={{ width: '10%' }}>Amount</th>
                              <th style={{ width: '10%' }}>Status</th>
                            </tr>
                         </thead>
                         <tbody>
                            {orders.map(o => (
                               <tr key={o.id}>
                                  <td style={{ verticalAlign: 'top', paddingTop: '1.2rem' }}>
                                     <div style={{ fontWeight: '700', color: 'var(--admin-text)' }}>#{o.id.slice(-8).toUpperCase()}</div>
                                     <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)', marginTop: '0.3rem' }}>{o.createdAt?.toDate().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                     <div style={{ fontSize: '0.8rem', color: 'var(--admin-primary)', fontWeight: '600', marginTop: '0.5rem' }}>{o.paymentId === "Cash on Delivery" ? "COD" : "Paid Online"}</div>
                                  </td>
                                  <td style={{ verticalAlign: 'top', paddingTop: '1.2rem' }}>
                                     <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                       <div style={{ color: 'var(--admin-text)' }}><strong>✉️</strong> {o.userEmail}</div>
                                       <div style={{ color: 'var(--admin-text)', marginTop: '0.3rem' }}><strong>📞</strong> {o.address?.phone || "No phone provided"}</div>
                                       <div style={{ color: 'var(--admin-text-light)', marginTop: '0.5rem', whiteSpace: 'normal', lineHeight: '1.4' }}>
                                         <strong style={{ color: 'var(--admin-text)' }}>📍 Address:</strong><br />
                                         {o.address?.street || "No st"}, {o.address?.city}, {o.address?.state} - {o.address?.pincode}
                                       </div>
                                     </div>
                                  </td>
                                  <td style={{ verticalAlign: 'top', paddingTop: '1.2rem' }}>
                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                       {o.items?.map((item, idx) => (
                                         <div key={idx} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: idx !== o.items.length - 1 ? '1px dashed var(--border-color)' : 'none' }}>
                                            <img src={item.imageURL} alt={item.name} loading="lazy" style={{ width: '45px', height: '45px', objectFit: 'cover', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--surface-alt)', flexShrink: 0 }} />
                                            <div style={{ fontSize: '0.85rem' }}>
                                              <div style={{ fontWeight: '600', color: 'var(--admin-text)', marginBottom: '0.2rem' }}>{item.name}</div>
                                              <div style={{ color: 'var(--admin-text-light)', display: 'flex', gap: '1rem' }}>
                                                 <span>Qty: <strong>{item.quantity}</strong></span>
                                                 <span>Price: <strong>₹{item.price}</strong></span>
                                              </div>
                                            </div>
                                         </div>
                                       ))}
                                     </div>
                                  </td>
                                  <td style={{ verticalAlign: 'top', paddingTop: '1.2rem' }}>
                                    <strong style={{ color: 'var(--admin-text)', fontSize: '1.1rem' }}>₹{o.total}</strong>
                                  </td>
                                  <td style={{ verticalAlign: 'top', paddingTop: '1.2rem' }}>
                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        <select 
                                           value={o.status} 
                                           onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                           style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: '600', width: '100%', background: 'var(--admin-surface)', color: 'var(--admin-text)', cursor: 'pointer' }}
                                        >
                                           <option value="pending">⏳ Pending</option>
                                           <option value="processing">⚙️ Processing</option>
                                           <option value="confirmed">👍 Confirmed</option>
                                           <option value="delivered">✅ Delivered</option>
                                           <option value="cancelled">❌ Cancelled</option>
                                        </select>
                                        {o.status === "cancelled" && (
                                           <button onClick={() => handleDeleteOrder(o.id)} className="btn-icon text-danger" title="Permanently delete order" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%', padding: '0.5rem' }}>
                                             🗑️ Delete
                                           </button>
                                        )}
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}
          </div>
       </div>

       {showProductModal && (
          <div className="modal-overlay">
             <div className="admin-modal">
                <div className="admin-modal-header">
                   <h3>{editProductId ? "Edit Product" : "Add Product"}</h3>
                   <button className="btn-close" onClick={() => setShowProductModal(false)}>✕</button>
                </div>
                <form onSubmit={handleProductSubmit} className="admin-form">
                   <div className="form-group">
                      <label>Product Name</label>
                      <input className="form-input" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                   </div>
                   <div className="form-row">
                      <div className="form-group">
                         <label>Category</label>
                         <input className="form-input" list="category-options" placeholder="Select or type category..." required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} />
                         <datalist id="category-options">
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                         </datalist>
                      </div>
                      <div className="form-group">
                         <label>Unit (e.g. 500g, 1L)</label>
                         <input className="form-input" required value={productForm.unit} onChange={e => setProductForm({...productForm, unit: e.target.value})} />
                      </div>
                   </div>
                   <div className="form-row">
                      <div className="form-group">
                         <label>Price (₹)</label>
                         <input className="form-input" type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                      </div>
                      <div className="form-group">
                         <label>MRP (₹)</label>
                         <input className="form-input" type="number" required value={productForm.mrp} onChange={e => setProductForm({...productForm, mrp: e.target.value})} />
                      </div>
                   </div>
                    <div className="form-row">
                       <div className="form-group">
                          <label>Delivery Charge (₹)</label>
                          <input className="form-input" type="number" value={productForm.deliveryCharge} onChange={e => setProductForm({...productForm, deliveryCharge: e.target.value})} />
                       </div>
                       <div className="form-group">
                          <label>Handling Fee (₹)</label>
                          <input className="form-input" type="number" value={productForm.handlingFee} onChange={e => setProductForm({...productForm, handlingFee: e.target.value})} />
                       </div>
                    </div>
                    <div className="form-row">
                       <div className="form-group">
                          <label>Stock Quantity</label>
                          <input className="form-input" type="number" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} />
                       </div>
                       <div className="form-group checkbox-group">
                          <label>Featured?</label>
                          <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} />
                       </div>
                    </div>
                   <div className="form-group">
                      <label>Image URL</label>
                      <input className="form-input" type="url" required value={productForm.imageURL} onChange={e => setProductForm({...productForm, imageURL: e.target.value})} />
                   </div>
                   <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-input" rows="3" required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                   </div>
                   <div className="modal-actions">
                      <button type="button" className="btn-outline" onClick={() => setShowProductModal(false)}>Cancel</button>
                      <button type="submit" className="btn-primary">Save Product</button>
                   </div>
                </form>
             </div>
          </div>
       )}
       {/* Custom Confirm Modal */}
       <ConfirmModal
         isOpen={confirmState.isOpen}
         title={confirmState.title}
         message={confirmState.message}
         onConfirm={confirmState.onConfirm}
         onCancel={() => setConfirmState({ ...confirmState, isOpen: false })}
       />
    </div>
  );
};

export default Admin;
