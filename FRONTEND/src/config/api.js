// Configuración centralizada de API URLs
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 segundos
};

// Helper para construir URLs de recursos
export const getResourceUrl = (path) => {
  // Si la ruta ya es absoluta, retornarla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Si la ruta comienza con /, usar BASE_URL
  if (path.startsWith('/')) {
    return `${API_CONFIG.BASE_URL}${path}`;
  }
  // De lo contrario, asumir que es un path relativo a /api
  return `${API_CONFIG.API_URL}/${path}`;
};

export default API_CONFIG;
