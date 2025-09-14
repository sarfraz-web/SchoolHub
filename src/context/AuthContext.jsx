import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi, initializeDemoData } from '../services/mockApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize demo data
    initializeDemoData();
    
    // Check for existing user
    const currentUser = userApi.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = userApi.login(email, password);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const register = async (userData) => {
    const result = userApi.register(userData);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const logout = () => {
    userApi.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
