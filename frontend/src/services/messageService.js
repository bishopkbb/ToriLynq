import api from './api';

const messageService = {
  // Get user's conversations
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response;
  },

  // Get or create conversation
  getOrCreateConversation: async (participantId) => {
    const response = await api.post('/conversations', { participantId });
    return response;
  },

  // Get conversation messages
  getMessages: async (conversationId, page = 1, limit = 50) => {
    const response = await api.get(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    return response;
  },

  // Send message
  sendMessage: async (conversationId, content, media = null) => {
    const formData = new FormData();
    formData.append('conversationId', conversationId);
    formData.append('content', content);
    if (media) {
      formData.append('media', media);
    }

    const response = await api.post('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response;
  },
};

export default messageService;
