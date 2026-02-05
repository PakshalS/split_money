/**
 * API Configuration
 * Centralized API base URL configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REQUEST_PASSWORD_RESET: `${API_BASE_URL}/auth/request-password-reset`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  },
  
  // Friends endpoints
  FRIENDS: {
    GET_FRIENDS: `${API_BASE_URL}/friends/get-friends`,
    GET_REQUESTS: `${API_BASE_URL}/friends/get-requests`,
    SEND_REQUEST: `${API_BASE_URL}/friends/send`,
    RESPOND: `${API_BASE_URL}/friends/respond`,
    REMOVE: (friendId) => `${API_BASE_URL}/friends/${friendId}/remove`,
  },
  
  // Groups endpoints (already using api/groups.js)
  GROUPS: `${API_BASE_URL}/groups`,
};

export default API_BASE_URL;
