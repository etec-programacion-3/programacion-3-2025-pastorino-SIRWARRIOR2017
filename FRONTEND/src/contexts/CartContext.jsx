import React, { createContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      let items;
      if (existing) {
        items = state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i));
      } else {
        items = [...state.items, { ...item, quantity: item.quantity || 1 }];
      }
      return { ...state, items };
    }
    case 'REMOVE_ITEM': {
      const id = action.payload;
      return { ...state, items: state.items.filter((i) => i.id !== id) };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } });
  };

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const getTotalItems = () => state.items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ cart: state.items, addItem, removeItem, clearCart, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
