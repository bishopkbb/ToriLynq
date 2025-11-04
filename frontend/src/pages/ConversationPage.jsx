import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Send, Image as ImageIcon, Smile, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fetchMessages, sendMessage, addMessage, updateMessageStatus } from '../store/slices/chatSlice';
import { useSocket } from '../contexts/SocketContext';
import Loader from '../components/common/Loader';

const ConversationPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();
  const { messages, isLoading, isSending } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mock conversation data
  const mockConversation = {
    _id: conversationId,
    participants: [
      { _id: user?._id, username: user?.username, avatar: user?.avatar },
      { _id: '1', username: 'AfroNomad', avatar: 'https://i.pravatar.cc/150?img=20', isOnline: true },
    ],
  };

  const otherUser = mockConversation.participants.find(p => p._id !== user?._id);

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages({ conversationId }));
      
      // Join conversation room
      if (socket.getSocket()?.connected) {
        socket.joinConversation(conversationId);
      }
    }

    return () => {
      if (conversationId && socket.getSocket()?.connected) {
        socket.leaveConversation(conversationId);
        socket.stopTyping(conversationId, otherUser?._id);
      }
    };
  }, [conversationId, dispatch, socket]);

  // Socket listeners
  useEffect(() => {
    if (!socket.getSocket()) return;

    // Listen for new messages
    socket.onNewMessage((message) => {
      if (message.conversation === conversationId) {
        dispatch(addMessage(message));
      }
    });

    // Listen for message read
    socket.onMessageRead(({ messageId, readAt }) => {
      dispatch(updateMessageStatus({ messageId, isRead: true, readAt }));
    });

    // Listen for typing indicators
    socket.onTypingStart(({ conversationId: convId, userId, username }) => {
      if (convId === conversationId && userId !== user?._id) {
        setTypingUser(username);
      }
    });

    socket.onTypingStop(({ conversationId: convId, userId }) => {
      if (convId === conversationId && userId !== user?._id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, conversationId, user?._id, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);

    // Start typing indicator
    if (!isTyping && socket.getSocket()?.connected) {
      setIsTyping(true);
      socket.startTyping(conversationId, otherUser?._id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket.getSocket()?.connected) {
        socket.stopTyping(conversationId, otherUser?._id);
      }
    }, 2000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;

    // Stop typing indicator
    if (isTyping && socket.getSocket()?.connected) {
      socket.stopTyping(conversationId, otherUser?._id);
      setIsTyping(false);
    }

    const tempMessage = {
      _id: Date.now().toString(),
      content: messageText,
      sender: { _id: user?._id, username: user?.username, avatar: user?.avatar },
      createdAt: new Date(),
      isRead: false,
      delivered: false, // Pending delivery
    };

    dispatch(addMessage(tempMessage));
    setMessageText('');

    try {
      const result = await dispatch(sendMessage({
        conversationId,
        content: messageText,
      })).unwrap();
      
      // Update message with delivered status
      dispatch(updateMessageStatus({ 
        messageId: result.data._id, 
        delivered: true 
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally show error indicator on message
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    alert('Image upload coming soon!');
  };

  const getMessageStatus = (message) => {
    if (message.sender?._id !== user?._id) return null;

    if (message.isRead) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    } else if (message.delivered !== false) {
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    } else {
      return <Check className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 flex-1">
            <button
              onClick={() => navigate('/chat')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>

            <img
              src={otherUser?.avatar}
              alt={otherUser?.username}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                @{otherUser?.username}
              </p>
              <p className="text-xs text-gray-500">
                {typingUser ? (
                  <span className="text-primary-500 animate-pulse">typing...</span>
                ) : otherUser?.isOnline ? (
                  <span className="text-primary-500">● Online</span>
                ) : (
                  `Last seen ${otherUser?.lastSeen ? formatDistanceToNow(new Date(otherUser.lastSeen), { addSuffix: true }) : 'recently'}`
                )}
              </p>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message, index) => {
              const isMe = message.sender?._id === user?._id;
              const showAvatar = index === 0 || messages[index - 1]?.sender?._id !== message.sender?._id;

              return (
                <div
                  key={message._id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${!showAvatar && !isMe ? 'ml-12' : ''}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[70%] ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isMe && showAvatar && (
                      <img
                        src={message.sender?.avatar || otherUser?.avatar}
                        alt={message.sender?.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {!isMe && !showAvatar && <div className="w-8" />}

                    <div>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isMe
                            ? 'bg-primary-500 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <div className={`flex items-center space-x-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </p>
                        {isMe && getMessageStatus(message)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {typingUser && (
              <div className="flex justify-start ml-12">
                <div className="flex items-end space-x-2">
                  <div className="px-4 py-2 bg-gray-100 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ImageIcon className="w-6 h-6 text-gray-600" />
          </button>

          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Smile className="w-6 h-6 text-gray-600" />
          </button>

          <input
            type="text"
            value={messageText}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <button
            type="submit"
            disabled={!messageText.trim() || isSending}
            className="p-2 bg-primary-500 hover:bg-primary-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationPage;
