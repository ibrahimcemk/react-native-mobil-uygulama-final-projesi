import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';
import logger from '../utils/logger';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    logger.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    logger.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    logger.log('📥 API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    logger.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');

      
      return Promise.reject(error);
    }

    if (!error.response) {
      error.isNetworkError = true;
    }

    return Promise.reject(error);
  }
);

  
export const handleApiError = (error) => {
  if (error.isNetworkError || !error.response) {
    return {
      message: 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.',
      status: 0,
      isNetworkError: true
    };
  }

  if (error.response) {
    const { data, status } = error.response;

    let message = 'Bir hata oluştu';
    if (data?.detail?.message) {
      message = data.detail.message;
    } else if (data?.message) {
      message = data.message;
    } else if (data?.detail) {
      message = typeof data.detail === 'string' ? data.detail : 'İşlem başarısız';
    }

    return {
      message,
      status,
      errors: data?.errors || null,
      detail: data?.detail || null
    };
  }

  return {
    message: error.message || 'Bilinmeyen hata',
    status: -1
  };
};

export default apiClient;
