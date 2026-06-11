import apiClient, { handleApiError } from './client';

export const userApi = {
  register: async (data) => {
    try {
      const response = await apiClient.post('/users/register', data);
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

  login: async (email, sifre) => {
    try {
      const response = await apiClient.post('/users/login', { email, sifre });
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

  getMe: async () => {
    try {
      const response = await apiClient.get('/users/me');
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

  getUser: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
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

  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/users', { params });
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
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

  updateUser: async (userId, data) => {
    try {
      const response = await apiClient.patch(`/users/${userId}`, data);
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

  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
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
