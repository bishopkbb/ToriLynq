import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/update', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  // Update password
  updatePassword: async (passwords) => {
    return await api.put('/auth/update-password', passwords);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
