import { useState, useCallback } from 'react';
import apiClient from '../api/client';

export const useCRUD = (baseUrl) => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const handleResponse = (response) => {
    if (!response.data.success) {
      throw new Error(response.data.message || 'İşlem başarısız');
    }
    return response.data;
  };

  const getAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(baseUrl, { params });
      const result = handleResponse(response);
      
      setItems(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
      
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.detail?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const getOne = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`${baseUrl}/${id}`);
      const result = handleResponse(response);
      
      setItem(result.data);
      return result.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const create = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(baseUrl, data);
      const result = handleResponse(response);
      
      setItems(prev => [...prev, result.data]);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.detail?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const update = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch(`${baseUrl}/${id}`, data);
      const result = handleResponse(response);
      
      setItems(prev => prev.map(i => i.id === id ? result.data : i));
      if (item?.id === id) {
        setItem(result.data);
      }
      
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.detail?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, item]);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.delete(`${baseUrl}/${id}`);
      const result = handleResponse(response);
      
      setItems(prev => prev.filter(i => i.id !== id));
      if (item?.id === id) {
        setItem(null);
      }
      
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.detail?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, item]);

  return {
    items,
    item,
    loading,
    error,
    pagination,
    getAll,
    getOne,
    create,
    update,
    remove,
    setItems,
    setItem
  };
};
