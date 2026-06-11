import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const {
    method = 'GET',
    body = null,
    autoFetch = true,
    onSuccess = null,
    onError = null
  } = options;

  const execute = useCallback(async (customBody = null) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const config = {
        method,
        url
      };

      if (customBody || body) {
        config.data = customBody || body;
      }

      const response = await apiClient(config);
      
      const responseData = response.data;
      
      if (responseData.success) {
        setData(responseData.data);
        setMessage(responseData.message);
        if (onSuccess) onSuccess(responseData.data);
      } else {
        setError(responseData.message || 'Bir hata oluştu');
        if (onError) onError(responseData.message);
      }

      return responseData;
    } catch (err) {
      const errorMsg = err.response?.data?.detail?.message || 
                       err.response?.data?.message || 
                       err.message || 
                       'Bağlantı hatası';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [url, method, body, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch && method === 'GET') {
      execute();
    }
  }, [autoFetch, method, execute]);

  return {
    data,
    loading,
    error,
    message,
    execute,
    refetch: execute
  };
};
