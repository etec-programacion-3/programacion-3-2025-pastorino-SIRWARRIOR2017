import { createContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const SiteConfigContext = createContext();

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    siteName: 'PC Store',
    siteSlogan: 'Los mejores componentes PC',
    logo: null,
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    email: '',
    phone: '',
    address: '',
    googleMapsUrl: '',
    facebook: '',
    instagram: '',
    twitter: '',
    currency: '$',
    taxRate: 16.00,
    shippingCost: 50.00,
    freeShippingThreshold: 1000.00
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await api.getSiteSettings();
      setConfig(data);

      // Actualizar el título de la página
      document.title = data.siteName || 'PC Store';
    } catch (err) {
      console.error('Error loading site config:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshConfig = async () => {
    await fetchConfig();
  };

  return (
    <SiteConfigContext.Provider value={{ config, loading, refreshConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export default SiteConfigContext;
