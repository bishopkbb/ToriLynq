import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import { fetchConversations } from '../store/slices/chatSlice';
import Loader from '../components/common/Loader';

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversations, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Mock conversations as fallback
  const mockConversations = [
    {
      _id: 'mock-1',
      participants: [
        { _id: '1', username: 'AfroNomad', avatar: 'https://i.pravatar.cc/150?img=20', isOnline: true },
      ],
      lastMessage: {
        content: 'Hey! How are you doing?',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        sender: '1',
      },
      updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      _id: 'mock-2',
      participants: [
        { _id: '2', username: 'CultureQueen', avatar: 'https://i.pravatar.cc/150?img=21', isOnline: false, lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      ],
      lastMessage: {
        content: 'That sounds amazing! 🎉',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        sender: user?._id,
      },
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
  ];

  const displayConversations = conversations.length > 0 ? conversations : mockConversations;

  const filteredConversations = displayConversations.filter((conv) => {
    const otherUser = conv.participants.find(p => p._id !== user?._id);
    return otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherUser = (participants) => {
    return participants?.find(p => p._id !== user?._id) || participants?.[0];
  };

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        {isLoading ? (
          <div className="py-8">
            <Loader />
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => {
              const otherUser = getOtherUser(conversation.participants);
              const isMe = conversation.lastMessage?.sender === user?._id;
              
              return (
                <button
                  key={conversation._id}
                  onClick={() => navigate(`/chat/${conversation._id}`)}
                  className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={otherUser?.avatar || 'https://i.pravatar.cc/150'}
                        alt={otherUser?.username}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      {otherUser?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 truncate">
                          @{otherUser?.username}
                        </p>
                        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {conversation.lastMessage?.createdAt && 
                            formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })
                          }
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate">
                        {isMe && <span className="text-gray-500">You: </span>}
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!conversation.lastMessage?.isRead && !isMe && (
                      <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Messages Yet</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'No conversations match your search' : 'Start chatting with people you follow'}
            </p>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default ChatPage;
