import api from './api';

const postService = {
  // Get feed posts (with pagination)
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response;
  },

  // Get single post
  getPost: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response;
  },

  // Create post
  createPost: async (formData) => {
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Like/Unlike post
  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response;
  },

  // Get comments
  getComments: async (postId, page = 1, limit = 20) => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
    return response;
  },

  // Add comment
  addComment: async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response;
  },

  // Get posts by hashtag
  getByHashtag: async (tag, page = 1, limit = 10) => {
    const response = await api.get(`/posts/hashtag/${tag}?page=${page}&limit=${limit}`);
    return response;
  },

  // Get user posts
  getUserPosts: async (username, page = 1, limit = 10) => {
    const response = await api.get(`/posts/user/${username}?page=${page}&limit=${limit}`);
    return response;
  },
};

export default postService;
