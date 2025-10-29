import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import TechnicalService from './pages/TechnicalService';

// User Pages
import Profile from './pages/user/Profile';
import OrderHistory from './pages/user/OrderHistory';
import ServiceHistory from './pages/user/ServiceHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="technical-service" element={<TechnicalService />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* User Routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="service-history" element={<ServiceHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;