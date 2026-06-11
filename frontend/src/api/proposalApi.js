import apiClient, { handleApiError } from './client';

export const proposalApi = {
  createProposal: async (projectId, data) => {
    try {
      const response = await apiClient.post(`/proposals/project/${projectId}`, data);
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

  getProjectProposals: async (projectId) => {
    try {
      const response = await apiClient.get(`/proposals/project/${projectId}`);
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

  getMyProposals: async () => {
    try {
      const response = await apiClient.get('/proposals/my-proposals');
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

  getProposal: async (proposalId) => {
    try {
      const response = await apiClient.get(`/proposals/${proposalId}`);
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

  updateProposal: async (proposalId, data) => {
    try {
      const response = await apiClient.patch(`/proposals/${proposalId}`, data);
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

  acceptProposal: async (proposalId) => {
    try {
      const response = await apiClient.post(`/proposals/${proposalId}/accept`);
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

  rejectProposal: async (proposalId) => {
    try {
      const response = await apiClient.post(`/proposals/${proposalId}/reject`);
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

  withdrawProposal: async (proposalId) => {
    try {
      const response = await apiClient.post(`/proposals/${proposalId}/withdraw`);
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

  deleteProposal: async (proposalId) => {
    try {
      const response = await apiClient.delete(`/proposals/${proposalId}`);
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
