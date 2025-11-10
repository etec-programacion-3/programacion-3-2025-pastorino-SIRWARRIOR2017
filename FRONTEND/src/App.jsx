import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import TechnicalService from './pages/TechnicalService';
import Checkout from './pages/Checkout';
import OAuthCallback from './pages/OAuthCallback';
import PCBuilder from './pages/PCBuilder';

// User Pages
import Profile from './pages/user/Profile';
import OrderHistory from './pages/user/OrderHistory';
import ServiceHistory from './pages/user/ServiceHistory';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import ServiceRequestsManagement from './pages/admin/ServiceRequestsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="pc-builder" element={<PCBuilder />} />
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="technical-service" element={<TechnicalService />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="auth/callback" element={<OAuthCallback />} />

          {/* Protected User Routes */}
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="service-history" element={
            <ProtectedRoute>
              <ServiceHistory />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin/products" element={
            <ProtectedRoute requireAdmin={true}>
              <ProductsManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/orders" element={
            <ProtectedRoute requireAdmin={true}>
              <OrdersManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/service-requests" element={
            <ProtectedRoute requireAdmin={true}>
              <ServiceRequestsManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedRoute requireAdmin={true}>
              <UsersManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/reports" element={
            <ProtectedRoute requireAdmin={true}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="admin/settings" element={
            <ProtectedRoute requireAdmin={true}>
              <Settings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;