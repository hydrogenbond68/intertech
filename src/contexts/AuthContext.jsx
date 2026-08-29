import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        apiService.setToken(token);
        setUser(userData);
        setLoading(false);
        verifyToken();
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const data = await apiService.getCurrentUser();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      apiService.setToken(null);
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiService.login({ email, password });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.access_token);
      apiService.setToken(data.access_token);
      setError(null);
      return { success: true, user: data.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiService.register(userData);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.access_token);
      apiService.setToken(data.access_token);
      setError(null);
      return { success: true, user: data.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    apiService.setToken(null);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  const updateProfile = async (data) => {
    try {
      const response = await apiService.updateProfile(data);
      // Update user state
      setUser(response.user);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    isVerified: user?.is_verified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
