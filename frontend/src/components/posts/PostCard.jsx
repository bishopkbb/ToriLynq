import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toggleLikePost } from '../../store/slices/postsSlice';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.liked || false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return; // Prevent double clicks
    
    setIsLiking(true);
    const newLiked = !liked;
    const newCount = newLiked ? likesCount + 1 : likesCount - 1;
    
    // Optimistic update
    setLiked(newLiked);
    setLikesCount(newCount);

    try {
      // Only dispatch if it's a real post (not mock)
      if (!post._id.startsWith('mock-')) {
        await dispatch(toggleLikePost(post._id)).unwrap();
      }
    } catch (error) {
      // Revert on error
      setLiked(!newLiked);
      setLikesCount(likesCount);
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors animate-fadeIn">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.author?.avatar || 'https://i.pravatar.cc/150?img=10'}
            alt={post.author?.username}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
          />

          <div>
            <p className="font-semibold text-gray-900 hover:underline cursor-pointer">
              @{post.author?.username || 'User'}
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              {post.location && <><span className="mr-1">📍</span>{post.location} •{' '}</>}
              {formatDistanceToNow(new Date(post.createdAt || Date.now()), { addSuffix: true })}
            </p>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-900 text-sm lg:text-base whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Image/Video */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <img
            src={post.images[0]}
            alt="Post"
            className="w-full object-cover cursor-pointer"
            style={{ maxHeight: '600px' }}
          />
          {post.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <button className="w-16 h-16 lg:w-20 lg:h-20 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 hover:scale-110 transition-all shadow-lg">
                <svg
                  className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1"
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

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="px-4 pt-2 flex flex-wrap gap-2">
          {post.hashtags.map((tag, index) => (
            <span
              key={index}
              className="text-primary-500 text-sm hover:underline cursor-pointer font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4 lg:space-x-6">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center space-x-2 group disabled:opacity-50"
          >
            <Heart
              className={`w-6 h-6 transition-all ${
                liked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 group-hover:text-red-500'
              }`}
            />
            <span className={`text-sm font-medium ${liked ? 'text-red-500' : 'text-gray-600'}`}>
              {likesCount}
            </span>
          </button>

          {/* Comment */}
          <button className="flex items-center space-x-2 group">
            <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-primary-500 transition-colors" />
            <span className="text-sm font-medium text-gray-600">{post.commentsCount || 0}</span>
          </button>

          {/* Share */}
          <button className="flex items-center space-x-2 group">
            <Share2 className="w-6 h-6 text-gray-600 group-hover:text-primary-500 transition-colors" />
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="group"
        >
          <Bookmark
            className={`w-6 h-6 transition-all ${
              bookmarked ? 'fill-primary-500 text-primary-500' : 'text-gray-600 group-hover:text-primary-500'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
