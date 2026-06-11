import apiClient, { handleApiError } from './client';

export const uploadApi = {
  /**
   * @param {string} userId 
   * @param {string} imageUri 
   */
  uploadProfileImage: async (userId, imageUri) => {
    try {
      const formData = new FormData();
      
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: type,
      });

      const response = await apiClient.post(`/users/${userId}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  /**
   * @param {string} userId 
   */
  deleteProfileImage: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}/delete-image`);
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
