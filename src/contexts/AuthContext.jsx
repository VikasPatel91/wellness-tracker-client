// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      setUser(userData);
      await checkAuthStatus();
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await authAPI.register({ email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
       await checkAuthStatus();
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
const socialLogin = async (provider, accessToken = null) => {
  try {
    let response;
    
    if (accessToken) {
      // If we have an access token (from Firebase), use it
      response = await authAPI.socialLogin({ provider, accessToken });
    } else {
      // For direct OAuth flow (will redirect)
      window.location.href = `${API_BASE_URL}/auth/${provider}`;
      return { success: true, redirect: true };
    }
    
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    setUser(userData);
    
    return { success: true, user: userData };
  } catch (error) {
    console.error(`${provider} login error:`, error);
    return { 
      success: false, 
      message: error.response?.data?.message || `Failed to login with ${provider}` 
    };
  }
};
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    socialLogin 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};