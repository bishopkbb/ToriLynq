import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';

const NotificationsPage = () => {
  const navigate = useNavigate();

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: { username: 'AfroNomad', avatar: 'https://i.pravatar.cc/150?img=20' },
      post: { image: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=100' },
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
    },
    {
      id: 2,
      type: 'comment',
      user: { username: 'CultureQueen', avatar: 'https://i.pravatar.cc/150?img=21' },
      post: { image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=100' },
      comment: 'This is amazing! 🔥',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: 3,
      type: 'follow',
      user: { username: 'LagosBoy', avatar: 'https://i.pravatar.cc/150?img=22' },
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: 4,
      type: 'story_view',
      user: { username: 'AccraVibes', avatar: 'https://i.pravatar.cc/150?img=23' },
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isRead: true,
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-8 h-8 text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageCircle className="w-8 h-8 text-primary-500" />;
      case 'follow':
        return <UserPlus className="w-8 h-8 text-blue-500" />;
      case 'story_view':
        return <Play className="w-8 h-8 text-purple-500" />;
      default:
        return null;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return `commented: ${notification.comment}`;
      case 'follow':
        return 'started following you';
      case 'story_view':
        return 'viewed your story';
      default:
        return '';
    }
  };

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
                if (notification.post) {
                  navigate(`/post/${notification.post.id}`);
                } else if (notification.type === 'follow') {
                  navigate(`/profile/${notification.user.username}`);
                }
              }}
              className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                !notification.isRead ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* User Avatar */}
                <img
                  src={notification.user.avatar}
                  alt={notification.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">@{notification.user.username}</span>{' '}
                    <span className="text-gray-600">{getNotificationText(notification)}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {/* Post Thumbnail */}
                {notification.post && (
                  <img
                    src={notification.post.image}
                    alt="Post"
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                )}

                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default NotificationsPage;
