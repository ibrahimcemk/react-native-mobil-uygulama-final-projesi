import apiClient from './client';
import { ENDPOINTS } from './config';

export const photoApi = {
  uploadPhoto: async (photoFile, data = {}) => {
    const formData = new FormData();
    formData.append('file', photoFile);
    
    if (data.baslik) formData.append('baslik', data.baslik);
    if (data.konum) formData.append('konum', data.konum);
    formData.append('herkese_acik', data.herkese_acik !== undefined ? data.herkese_acik : true);
    
    const response = await apiClient.post(ENDPOINTS.UPLOAD_PHOTO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyPhotos: async (skip = 0, limit = 20) => {
    const response = await apiClient.get(ENDPOINTS.MY_PHOTOS, {
      params: { skip, limit }
    });
    return response.data;
  },

  getPublicFeed: async (skip = 0, limit = 20) => {
    const response = await apiClient.get(ENDPOINTS.PUBLIC_FEED, {
      params: { skip, limit }
    });
    return response.data;
  },

  getUserPhotos: async (userId, skip = 0, limit = 20) => {
    const response = await apiClient.get(ENDPOINTS.USER_PHOTOS(userId), {
      params: { skip, limit }
    });
    return response.data;
  },

  getPhoto: async (photoId) => {
    const response = await apiClient.get(ENDPOINTS.PHOTO_BY_ID(photoId));
    return response.data;
  },

  updatePhoto: async (photoId, data) => {
    const response = await apiClient.patch(ENDPOINTS.PHOTO_BY_ID(photoId), data);
    return response.data;
  },

  deletePhoto: async (photoId) => {
    const response = await apiClient.delete(ENDPOINTS.PHOTO_BY_ID(photoId));
    return response.data;
  },

  toggleLike: async (photoId) => {
    const response = await apiClient.post(`/photos/${photoId}/like`);
    return response.data;
  },

  addComment: async (photoId, yorum) => {
    const response = await apiClient.post(`/photos/${photoId}/comments`, { yorum });
    return response.data;
  },

  getComments: async (photoId, skip = 0, limit = 50) => {
    const response = await apiClient.get(`/photos/${photoId}/comments`, {
      params: { skip, limit }
    });
    return response.data;
  },

  deleteComment: async (photoId, commentId) => {
    const response = await apiClient.delete(`/photos/${photoId}/comments/${commentId}`);
    return response.data;
  },
};
