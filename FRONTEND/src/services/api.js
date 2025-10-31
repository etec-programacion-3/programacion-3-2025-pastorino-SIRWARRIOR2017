import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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

// Interceptor para detectar usuarios bloqueados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 403 y el mensaje indica cuenta bloqueada
    if (error.response?.status === 403 && error.response?.data?.error === 'Account blocked') {
      // Emitir evento personalizado para que AuthContext lo detecte
      window.dispatchEvent(new CustomEvent('user-blocked', {
        detail: {
          message: error.response.data.message,
          reason: error.response.data.reason
        }
      }));
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