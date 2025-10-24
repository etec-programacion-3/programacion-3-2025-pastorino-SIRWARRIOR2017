import React, { createContext, useReducer, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user || null, token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [state.token]);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    // Expecting { token, user }
    dispatch({ type: 'LOGIN', payload: data });
    return data;
  };

  const register = async (credentials) => {
    const data = await api.register(credentials);
    // Optionally auto-login after register
    if (data?.token) dispatch({ type: 'LOGIN', payload: data });
    return data;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
