import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const CartContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null,
  notification: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_REQUEST':
      return { ...state, loading: true, error: null };

    case 'CART_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        notification: {
          type: 'error',
          message: action.payload
        }
      };

    case 'SET_ITEMS': {
      return {
        ...state,
        items: action.payload,
        lastUpdated: Date.now(),
        loading: false,
      };
    }

    case 'ADD_ITEM': {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      let items;

      if (existing) {
        items = state.items.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      } else {
        items = [...state.items, { ...item, quantity: item.quantity || 1 }];
      }

      return {
        ...state,
        items,
        lastUpdated: Date.now(),
        loading: false,
        notification: {
          type: 'success',
          message: 'Producto agregado al carrito'
        }
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const items = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      return {
        ...state,
        items,
        lastUpdated: Date.now(),
        loading: false,
        notification: {
          type: 'info',
          message: 'Cantidad actualizada'
        }
      };
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items,
        lastUpdated: Date.now(),
        loading: false,
        notification: {
          type: 'info',
          message: 'Producto eliminado del carrito'
        }
      };
    }

    case 'CLEAR_CART':
      return {
        ...initialState,
        notification: {
          type: 'info',
          message: 'Carrito vaciado'
        }
      };

    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notification: null
      };

    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Escuchar evento de logout para limpiar el carrito
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: 'CLEAR_CART' });
      setIsInitialized(false);
    };

    window.addEventListener('user-logout', handleLogout);

    return () => {
      window.removeEventListener('user-logout', handleLogout);
    };
  }, []);

  // Sincronizar carrito con el backend (UNIFICADO - sin duplicación)
  useEffect(() => {
    const syncCartWithBackend = async () => {
      const token = localStorage.getItem('token');

      if (token && !isInitialized) {
        try {
          // Cargar items del backend
          const backendCart = await api.getCart();
          if (backendCart && backendCart.length > 0) {
            // Mapear CartItems a formato del frontend
            const items = backendCart.map(cartItem => ({
              ...cartItem.Product,
              quantity: cartItem.quantity
            }));
            dispatch({ type: 'SET_ITEMS', payload: items });
          }
        } catch (error) {
          console.error('Error syncing cart with backend:', error);
        }
        setIsInitialized(true);
      } else if (!token) {
        // Si no hay token, asegurar que el carrito esté vacío
        dispatch({ type: 'CLEAR_CART' });
        setIsInitialized(false);
      }
    };

    // Escuchar evento de login para sincronizar
    const handleLogin = () => {
      setIsInitialized(false); // Resetear para forzar sincronización
    };

    window.addEventListener('user-login', handleLogin);
    syncCartWithBackend();

    return () => {
      window.removeEventListener('user-login', handleLogin);
    };
  }, [isInitialized]);

  // Limpiar notificaciones después de 3 segundos
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.notification]);

  const addItem = useCallback(async (product, quantity = 1) => {
    try {
      dispatch({ type: 'CART_REQUEST' });

      // Verificar stock disponible
      const currentItem = state.items.find(item => item.id === product.id);
      const totalQuantity = (currentItem?.quantity || 0) + quantity;

      if (totalQuantity > product.stock) {
        throw new Error(`Solo hay ${product.stock} unidades disponibles`);
      }

      // Si hay sesión activa, sincronizar con el backend
      const token = localStorage.getItem('token');
      if (token) {
        await api.addToCart(product.id, quantity);
      }

      dispatch({
        type: 'ADD_ITEM',
        payload: { ...product, quantity }
      });
    } catch (error) {
      dispatch({
        type: 'CART_ERROR',
        payload: error.message
      });
      throw error;
    }
  }, [state.items]);

  const updateQuantity = useCallback(async (id, quantity) => {
    try {
      dispatch({ type: 'CART_REQUEST' });

      const item = state.items.find(item => item.id === id);
      if (!item) throw new Error('Producto no encontrado en el carrito');

      // Verificar stock actualizado
      const product = await api.getProductById(id);
      if (quantity > product.stock) {
        throw new Error(`Solo hay ${product.stock} unidades disponibles`);
      }

      // Sincronizar con el backend si hay sesión activa
      const token = localStorage.getItem('token');
      if (token) {
        // Buscar el CartItem en el backend para actualizar
        const backendCart = await api.getCart();
        const cartItem = backendCart.find(ci => ci.productId === id);
        if (cartItem) {
          await api.updateCartItem(cartItem.id, quantity);
        }
      }

      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, quantity }
      });
    } catch (error) {
      dispatch({
        type: 'CART_ERROR',
        payload: error.message
      });
      throw error;
    }
  }, [state.items]);

  const removeItem = useCallback(async (id) => {
    try {
      // Sincronizar con el backend si hay sesión activa
      const token = localStorage.getItem('token');
      if (token) {
        // Buscar el CartItem en el backend para eliminar
        const backendCart = await api.getCart();
        const cartItem = backendCart.find(ci => ci.productId === id);
        if (cartItem) {
          await api.removeFromCart(cartItem.id);
        }
      }

      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } catch (error) {
      console.error('Error removing item from backend:', error);
      // Eliminar del frontend aunque falle el backend
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      // Limpiar el backend si hay sesión activa
      const token = localStorage.getItem('token');
      if (token) {
        await api.clearCart();
      }
    } catch (error) {
      console.error('Error clearing backend cart:', error);
    }

    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getTotalItems = useCallback(() => {
    return state.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [state.items]);

  const getTotalPrice = useCallback(() => {
    return state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [state.items]);

  const validateStock = useCallback(async () => {
    try {
      dispatch({ type: 'CART_REQUEST' });

      for (const item of state.items) {
        const product = await api.getProductById(item.id);
        if (item.quantity > product.stock) {
          throw new Error(`Stock insuficiente para ${product.name}`);
        }
      }

      return true;
    } catch (error) {
      dispatch({
        type: 'CART_ERROR',
        payload: error.message
      });
      return false;
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{
      items: state.items,
      loading: state.loading,
      error: state.error,
      notification: state.notification,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getTotalItems,
      getTotalPrice,
      validateStock
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
