import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Componente de loading
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
  >
    <CircularProgress />
  </Box>
);

// Lazy loading de páginas públicas
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const TechnicalService = lazy(() => import('./pages/TechnicalService'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PCBuilder = lazy(() => import('./pages/PCBuilder'));

// Lazy loading de páginas de usuario
const Profile = lazy(() => import('./pages/user/Profile'));
const OrderHistory = lazy(() => import('./pages/user/OrderHistory'));
const ServiceHistory = lazy(() => import('./pages/user/ServiceHistory'));

// Lazy loading de páginas de admin
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductsManagement = lazy(() => import('./pages/admin/ProductsManagement'));
const OrdersManagement = lazy(() => import('./pages/admin/OrdersManagement'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const Settings = lazy(() => import('./pages/admin/Settings'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;