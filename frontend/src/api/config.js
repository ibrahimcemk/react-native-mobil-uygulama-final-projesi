
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

export { API_BASE_URL };  

export const ENDPOINTS = {
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  UPLOAD_PROFILE_IMAGE: (id) => `/users/${id}/upload-image`,
  DELETE_PROFILE_IMAGE: (id) => `/users/${id}/delete-image`,
  
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,
  
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  OPEN_PROJECTS: '/projects/open',
  MY_PROJECTS: '/projects/my-projects',
  SELECT_FREELANCER: (id) => `/projects/${id}/select-freelancer`,
  COMPLETE_PROJECT: (id) => `/projects/${id}/complete`,
  CANCEL_PROJECT: (id) => `/projects/${id}/cancel`,
  
  PROPOSALS: '/proposals',
  PROPOSAL_BY_ID: (id) => `/proposals/${id}`,
  CREATE_PROPOSAL: (projectId) => `/proposals/project/${projectId}`,
  PROJECT_PROPOSALS: (projectId) => `/proposals/project/${projectId}`,
  MY_PROPOSALS: '/proposals/my-proposals',
  ACCEPT_PROPOSAL: (id) => `/proposals/${id}/accept`,
  REJECT_PROPOSAL: (id) => `/proposals/${id}/reject`,
  WITHDRAW_PROPOSAL: (id) => `/proposals/${id}/withdraw`,
  
  REVIEWS: '/reviews',
  REVIEW_BY_ID: (id) => `/reviews/${id}`,
  CREATE_REVIEW: (projectId) => `/reviews/project/${projectId}`,
  USER_REVIEWS: (userId) => `/reviews/user/${userId}`,
  PROJECT_REVIEWS: (projectId) => `/reviews/project/${projectId}`,
  USER_STATS: (userId) => `/reviews/user/${userId}/stats`,
  
  UPLOAD_PHOTO: '/photos/upload',
  MY_PHOTOS: '/photos/my-photos',
  PUBLIC_FEED: '/photos/feed',
  USER_PHOTOS: (userId) => `/photos/user/${userId}`,
  PHOTO_BY_ID: (id) => `/photos/${id}`,
  
  SEND_MESSAGE: '/messages/send',
  CONVERSATIONS: '/messages/conversations',
  UNREAD_MESSAGE_COUNT: '/messages/unread-count',
  START_CONVERSATION: '/messages/start-conversation',
};

export const API_TIMEOUT = 30000; 

export const DEBUG = __DEV__; 
