import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 30);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="bg-white border-b border-gray-200 animate-fadeIn">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={post.author?.avatar || 'https://i.pravatar.cc/150?img=10'}
              alt={post.author?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
          </div>

          {/* User Info */}
          <div>
            <p className="font-semibold text-gray-900">@{post.author?.username || 'AfroNomadStories'}</p>
            <p className="text-xs text-gray-500 flex items-center">
              <span className="mr-1">📍</span>
              {post.location || 'Accra, Ghana'}
            </p>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Post Image/Video */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <img
            src={post.images[0]}
            alt="Post"
            className="w-full h-auto object-cover"
          />
          {post.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Post Content */}
      <div className="px-4 py-3">
        <p className="text-gray-900 mb-2">{post.content}</p>
        
        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.hashtags.map((tag, index) => (
              <span key={index} className="text-primary-500 text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 group"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  liked ? 'fill-red-500 text-red-500' : 'text-gray-600 group-hover:text-red-500'
                }`}
              />
            </button>

            {/* Comment Button */}
            <button className="flex items-center space-x-1 group">
              <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-primary-500 transition-colors" />
            </button>

            {/* Share Button */}
            <button className="flex items-center space-x-1 group">
              <Share2 className="w-6 h-6 text-gray-600 group-hover:text-primary-500 transition-colors" />
            </button>
          </div>

          {/* Likes Count */}
          <div className="flex items-center space-x-1">
            <Share2 className="w-4 h-4 text-primary-500" />
            <span className="text-primary-500 font-semibold">{likesCount}</span>
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mt-2">
          {formatDistanceToNow(new Date(post.createdAt || Date.now()), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
