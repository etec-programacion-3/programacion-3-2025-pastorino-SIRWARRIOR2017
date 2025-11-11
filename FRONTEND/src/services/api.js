import axios from 'axios';

// Usar variables de entorno con fallback para desarrollo
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage on each request if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Retry logic con exponential backoff
const retryRequest = async (error) => {
  const config = error.config;

  // No reintentar si ya se intentó el máximo de veces o si es un error del cliente (4xx)
  if (!config || config.__retryCount >= 3 || (error.response && error.response.status < 500)) {
    return Promise.reject(error);
  }

  config.__retryCount = config.__retryCount || 0;
  config.__retryCount += 1;

  // Exponential backoff: 1s, 2s, 4s
  const backoff = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000 * Math.pow(2, config.__retryCount - 1));
  });

  await backoff;
  return api(config);
};

// Interceptor para detectar usuarios bloqueados y manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el error es 403 y el mensaje indica cuenta bloqueada
    if (error.response?.status === 403 && error.response?.data?.error === 'Account blocked') {
      // Emitir evento personalizado para que AuthContext lo detecte
      window.dispatchEvent(new CustomEvent('user-blocked', {
        detail: {
          message: error.response.data.message,
          reason: error.response.data.reason
        }
      }));
      return Promise.reject(error);
    }

    // Reintentar en caso de error de red o error 5xx
    if (!error.response || error.response.status >= 500) {
      try {
        return await retryRequest(error);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los productos');
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el producto');
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las categorías');
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    // backend returns { error: '...' } on failures
    const msg = error.response?.data?.error || error.response?.data?.message || error.message || 'Error en login';
    throw new Error(msg);
  }
};

export const register = async (credentials) => {
  try {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.response?.data?.message || error.message || 'Error en registro';
    throw new Error(msg);
  }
};

// ========== SITE SETTINGS ==========
export const getSiteSettings = async () => {
  try {
    const response = await api.get("/site-settings");
    return response.data;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    throw error;
  }
};

export const updateSiteSettings = async (settings) => {
  try {
    const response = await api.put("/site-settings", settings);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al actualizar configuración";
    throw new Error(msg);
  }
};

export const uploadLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await api.post("/site-settings/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al subir logo";
    throw new Error(msg);
  }
};

// ========== ORDERS ==========
export const getOrders = async (filters = {}) => {
  try {
    const response = await api.get("/orders", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al crear la orden";
    throw new Error(msg);
  }
};

export const updateOrder = async (orderId, updates) => {
  try {
    const response = await api.put(`/orders/${orderId}`, updates);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al actualizar la orden";
    throw new Error(msg);
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al cancelar la orden";
    throw new Error(msg);
  }
};

// ========== CART ==========
export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    // El backend retorna { items: [...], summary: {...} }
    // Retornamos solo los items para compatibilidad con CartContext
    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post("/cart", { productId, quantity });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al agregar al carrito";
    throw new Error(msg);
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al actualizar item";
    throw new Error(msg);
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al eliminar del carrito";
    throw new Error(msg);
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete("/cart");
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al limpiar el carrito";
    throw new Error(msg);
  }
};

// ========== SERVICE REQUESTS ==========
export const getServiceRequests = async () => {
  try {
    const response = await api.get("/service-requests");
    return response.data;
  } catch (error) {
    console.error("Error fetching service requests:", error);
    throw error;
  }
};
