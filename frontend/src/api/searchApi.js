import apiClient from './client';

export const searchApi = {

  searchProjects: async (params = {}) => {
    const response = await apiClient.get('/search/projects', { params });
    return response.data;
  },

  
  searchUsers: async (params = {}) => {
    const response = await apiClient.get('/search/users', { params });
    return response.data;
  },
};
