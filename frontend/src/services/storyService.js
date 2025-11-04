import api from './api';

const storyService = {
  // Get all active stories
  getStories: async () => {
    const response = await api.get('/stories');
    return response;
  },

  // Get single story
  getStory: async (storyId) => {
    const response = await api.get(`/stories/${storyId}`);
    return response;
  },

  // Create story
  createStory: async (formData) => {
    const response = await api.post('/stories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Delete story
  deleteStory: async (storyId) => {
    const response = await api.delete(`/stories/${storyId}`);
    return response;
  },

  // Mark story as viewed
  viewStory: async (storyId) => {
    const response = await api.post(`/stories/${storyId}/view`);
    return response;
  },

  // Get story viewers
  getViewers: async (storyId) => {
    const response = await api.get(`/stories/${storyId}/viewers`);
    return response;
  },

  // Get user's stories
  getUserStories: async (userId) => {
    const response = await api.get(`/stories/user/${userId}`);
    return response;
  },
};

export default storyService;
