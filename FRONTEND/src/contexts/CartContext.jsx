import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const CartContext = createContext();

const initialState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  loading: false,
  error: null,
  lastUpdated: null,
  notification: null,
};

// Cargar estado inicial desde localStorage
const loadInitialState = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      return {
        ...initialState,
        items: parsedCart,
        lastUpdated: Date.now(),
      };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return initialState;
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
  const [state, dispatch] = useReducer(reducer, loadInitialState());

  // Persistir carrito en localStorage
  useEffect(() => {
    if (state.items.length > 0 || state.lastUpdated) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, state.lastUpdated]);

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

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cart');
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
