import apiClient, { handleApiError } from './client';

export const projectApi = {
  createProject: async (data) => {
    try {
      const response = await apiClient.post('/projects', data);
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

  getProjects: async (params = {}) => {
    try {
      const response = await apiClient.get('/projects', { params });
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

  getOpenProjects: async (kategoriId = null) => {
    try {
      const params = kategoriId ? { kategori_id: kategoriId } : {};
      const response = await apiClient.get('/projects/open', { params });
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

  getMyProjects: async () => {
    try {
      const response = await apiClient.get('/projects/my-projects');
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

  getProject: async (projectId) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
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

  updateProject: async (projectId, data) => {
    try {
      const response = await apiClient.patch(`/projects/${projectId}`, data);
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

  selectFreelancer: async (projectId, freelancerId) => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/select-freelancer`, {
        freelancer_id: freelancerId
      });
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

  completeProject: async (projectId) => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/complete`);
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

  cancelProject: async (projectId) => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/cancel`);
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

  deleteProject: async (projectId) => {
    try {
      const response = await apiClient.delete(`/projects/${projectId}`);
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
