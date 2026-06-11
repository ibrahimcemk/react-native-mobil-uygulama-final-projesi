import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userApi } from '../api/userApi';
import logger from '../utils/logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('access_token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      logger.error('Kullanıcı yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, sifre) => {
    setLoading(true);
    try {
      const response = await userApi.login(email, sifre);
      
      if (response.success) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        
        setToken(response.data.access_token);
        setUser(response.data.user);
        
        return { 
          success: true, 
          message: response.message 
        };
      } else {
        return { 
          success: false, 
          message: response.message,
          errors: response.errors 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Giriş başarısız'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const response = await userApi.register(data);
      
      if (response.success) {
        return { 
          success: true, 
          message: response.message,
          data: response.data 
        };
      } else {
        return { 
          success: false, 
          message: response.message,
          errors: response.errors 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Kayıt başarısız' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const response = await userApi.getMe();
      if (response.success) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
      } else if (response.status === 401) {
        await logout();
      }
    } catch (error) {
      logger.error('Kullanıcı bilgileri güncellenemedi:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
