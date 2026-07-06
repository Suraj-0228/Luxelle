import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Guards
import ProtectedRoute from './guards/ProtectedRoute';
import AdminRoute from './guards/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Latest from './pages/Latest';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AddressBook from './pages/AddressBook';
import Settings from './pages/Settings';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import About from './pages/About';
import Contact from './pages/Contact';
import Sustainability from './pages/Sustainability';
import Careers from './pages/Careers';
import Press from './pages/Press';
import ShippingReturns from './pages/ShippingReturns';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';

// Admin Pages
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTaxes from './pages/admin/AdminTaxes';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <Routes>
      {/* Admin Panel (Protected + Admin Guarded) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="taxes" element={<AdminTaxes />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="latest" element={<Latest />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        
        {/* User Protected Routes */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/address"
          element={
            <ProtectedRoute>
              <AddressBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Informational Pages */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="sustainability" element={<Sustainability />} />
        <Route path="careers" element={<Careers />} />
        <Route path="press" element={<Press />} />
        <Route path="shipping-returns" element={<ShippingReturns />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="terms" element={<Terms />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
