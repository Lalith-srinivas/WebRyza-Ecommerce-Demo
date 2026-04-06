import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { seedCategories, seedSampleProducts } from "./services/productService";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

import Navbar from "./components/Navbar";
import MobileBottomNav from "./components/MobileBottomNav";
import FloatingCartBtn from "./components/FloatingCartBtn";
import CartDrawer from "./components/CartDrawer";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Search from "./pages/Search";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin";
import InfoPage from "./pages/InfoPage";
import CartPage from "./pages/Cart";
import CategoriesPage from "./pages/Categories";

// Layout wrapper for pages that need Navbar and CartDrawer
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="main-layout-content">
        <Outlet />
      </div>
      {/* Old mobile floating cart UI is removed in the new mobile system */}
      <MobileBottomNav />
      {/* Desktop-only drawer; mobile uses full /cart page */}
      <div className="desktop-only">
        <CartDrawer />
      </div>
    </>
  );
};

const App = () => {
  useEffect(() => {
    seedCategories();
    seedSampleProducts();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Admin does not share standard layout */}
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                
                {/* Checkout has special minimal layout usually */}
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

                {/* Everything else gets Navbar */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  {/* Simple content pages so footer links are not broken */}
                  <Route path="/about" element={<InfoPage />} />
                  <Route path="/careers" element={<InfoPage />} />
                  <Route path="/blog" element={<InfoPage />} />
                  <Route path="/press" element={<InfoPage />} />
                  <Route path="/privacy" element={<InfoPage />} />
                  <Route path="/terms" element={<InfoPage />} />
                  <Route path="/cookies" element={<InfoPage />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                  <Route path="*" element={
                    <div className="empty-state">
                      <h2>404 - Page Not Found</h2>
                      <p>The page you are looking for does not exist.</p>
                      <a href="/" className="btn-primary">Go Home</a>
                    </div>
                  } />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
