import apiClient, { handleApiError } from './client';

export const categoryApi = {
  getCategories: async (params = {}) => {
    try {
      const response = await apiClient.get('/categories', { params });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        ...handleApiError(error)
      };
    }
  },

  getCategory: async (categoryId) => {
    try {
      const response = await apiClient.get(`/categories/${categoryId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        ...handleApiError(error)
      };
    }
  },

  getRootCategories: async () => {
    try {
      const response = await apiClient.get('/categories', { 
        params: { ust_kategori_id: 'null' } 
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        ...handleApiError(error)
      };
    }
  },

  getSubcategories: async (parentId) => {
    try {
      const response = await apiClient.get('/categories', { 
        params: { ust_kategori_id: parentId } 
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        ...handleApiError(error)
      };
    }
  },

  createCategory: async (data) => {
    try {
      const response = await apiClient.post('/categories', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        ...handleApiError(error)
      };
    }
  },

  updateCategory: async (categoryId, data) => {
    try {
      const response = await apiClient.patch(`/categories/${categoryId}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        ...handleApiError(error)
      };
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await apiClient.delete(`/categories/${categoryId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        ...handleApiError(error)
      };
    }
  }
};
