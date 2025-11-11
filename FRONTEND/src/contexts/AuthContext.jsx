import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  lastActivity: null
};

// Recuperar estado del localStorage
const loadInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const lastActivity = localStorage.getItem('lastActivity');

    if (token) {
      // Verificar si el token ha expirado
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        // Token expirado, limpiar storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
        return initialState;
      }

      return {
        ...initialState,
        user,
        token,
        isAuthenticated: true,
        lastActivity: lastActivity ? parseInt(lastActivity) : null
      };
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
  }
  return initialState;
};

function reducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        lastActivity: Date.now()
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        lastActivity: null
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'UPDATE_LAST_ACTIVITY':
      return { ...state, lastActivity: Date.now() };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, loadInitialState());

  // Persistir cambios en localStorage
  useEffect(() => {
    if (state.token && state.user) {
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('lastActivity', state.lastActivity?.toString() || '');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('lastActivity');
    }
  }, [state.token, state.user, state.lastActivity]);

  // Auto logout después de 30 minutos de inactividad con warning
  useEffect(() => {
    let warningShown = false;

    const checkInactivity = () => {
      const lastActivity = state.lastActivity;
      if (!lastActivity || !state.isAuthenticated) return;

      const inactiveTime = Date.now() - lastActivity;
      const WARNING_TIME = 28 * 60 * 1000; // 28 minutos
      const LOGOUT_TIME = 30 * 60 * 1000; // 30 minutos

      // Mostrar advertencia 2 minutos antes del logout
      if (inactiveTime > WARNING_TIME && inactiveTime < LOGOUT_TIME && !warningShown) {
        warningShown = true;
        toast('Tu sesión expirará en 2 minutos por inactividad', {
          icon: '⏰',
          duration: 120000, // 2 minutos
          position: 'top-center'
        });
      }

      // Realizar logout
      if (inactiveTime > LOGOUT_TIME) {
        logout();
        toast.error('Sesión cerrada por inactividad');
      }
    };

    const interval = setInterval(checkInactivity, 60 * 1000); // Revisar cada minuto
    return () => clearInterval(interval);
  }, [state.lastActivity, state.isAuthenticated]);

  // Actualizar última actividad en interacción del usuario
  useEffect(() => {
    const updateActivity = () => {
      if (state.isAuthenticated) {
        dispatch({ type: 'UPDATE_LAST_ACTIVITY' });
      }
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, [state.isAuthenticated]);

  // Escuchar evento de usuario bloqueado
  useEffect(() => {
    const handleUserBlocked = (event) => {
      const { message, reason } = event.detail;

      // Desloguear al usuario
      dispatch({ type: 'LOGOUT' });

      // Mostrar mensaje de error
      toast.error(
        reason
          ? `${message}\nRazón: ${reason}`
          : message || 'Tu cuenta ha sido bloqueada. Contacta al administrador.',
        { duration: 6000 }
      );
    };

    window.addEventListener('user-blocked', handleUserBlocked);

    return () => {
      window.removeEventListener('user-blocked', handleUserBlocked);
    };
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });

      // Si viene de OAuth, ya tenemos el token y usuario
      if (credentials.skipApi) {
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: credentials.user, token: credentials.token } });
        // Disparar evento para sincronizar carrito
        window.dispatchEvent(new CustomEvent('user-login'));
        return { user: credentials.user, token: credentials.token };
      }

      const data = await api.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      // Disparar evento para sincronizar carrito
      window.dispatchEvent(new CustomEvent('user-login'));
      return data;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const data = await api.register(credentials);
      if (data?.token) {
        dispatch({ type: 'AUTH_SUCCESS', payload: data });
        // Disparar evento para sincronizar carrito
        window.dispatchEvent(new CustomEvent('user-login'));
      }
      return data;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = useCallback(async () => {
    // Limpiar el carrito del backend si hay sesión activa
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.clearCart();
      }
    } catch (error) {
      console.error('Error clearing backend cart on logout:', error);
    }

    // Limpiar el carrito del localStorage al cerrar sesión
    localStorage.removeItem('cart');
    dispatch({ type: 'LOGOUT' });

    // Disparar evento personalizado para que CartContext limpie el carrito
    window.dispatchEvent(new CustomEvent('user-logout'));
  }, []);

  const updateUser = useCallback((userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, []);

  const isAdmin = useCallback(() => {
    return state.user?.role === 'admin';
  }, [state.user]);

  const contextValue = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateUser,
    isAdmin
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
