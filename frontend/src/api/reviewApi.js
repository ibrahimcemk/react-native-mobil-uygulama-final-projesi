import apiClient, { handleApiError } from './client';

export const reviewApi = {
  createReview: async (projectId, data) => {
    try {
      const response = await apiClient.post(`/reviews/project/${projectId}`, data);
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

  getUserReviews: async (userId) => {
    try {
      const response = await apiClient.get(`/reviews/user/${userId}`);
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

  getProjectReviews: async (projectId) => {
    try {
      const response = await apiClient.get(`/reviews/project/${projectId}`);
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

  getUserStats: async (userId) => {
    try {
      const response = await apiClient.get(`/reviews/user/${userId}/stats`);
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

  getReview: async (reviewId) => {
    try {
      const response = await apiClient.get(`/reviews/${reviewId}`);
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

  updateReview: async (reviewId, data) => {
    try {
      const response = await apiClient.patch(`/reviews/${reviewId}`, data);
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

  deleteReview: async (reviewId) => {
    try {
      const response = await apiClient.delete(`/reviews/${reviewId}`);
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
