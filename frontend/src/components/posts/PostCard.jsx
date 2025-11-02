import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toggleLikePost, deletePost } from '../../store/slices/postsSlice';
import ImageGallery from './ImageGallery';
import EditPostModal from './EditPostModal';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(post.liked || false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?._id === post.author?._id;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const newLiked = !liked;
    const newCount = newLiked ? likesCount + 1 : likesCount - 1;
    
    setLiked(newLiked);
    setLikesCount(newCount);

    try {
      if (!post._id.startsWith('mock-')) {
        await dispatch(toggleLikePost(post._id)).unwrap();
      }
    } catch (error) {
      setLiked(!newLiked);
      setLikesCount(likesCount);
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      await dispatch(deletePost(post._id)).unwrap();
    } catch (error) {
      alert('Failed to delete post. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    setShowEditModal(true);
  };

  if (isDeleting) {
    return (
      <div className="bg-white border-b border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">Deleting post...</p>
      </div>
    );
  }

  return (
    <>
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

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                  {isOwner ? (
                    <>
                      <button
                        onClick={handleEdit}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Post</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Post</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                        Not Interested
                      </button>
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600">
                        Report Post
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-2">
          <p className="text-gray-900 text-sm lg:text-base whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Image Gallery */}
        {post.images && post.images.length > 0 && (
          <ImageGallery images={post.images} />
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="px-4 pt-3 flex flex-wrap gap-2">
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

            <button className="flex items-center space-x-2 group">
              <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-primary-500 transition-colors" />
              <span className="text-sm font-medium text-gray-600">{post.commentsCount || 0}</span>
            </button>

            <button className="flex items-center space-x-2 group">
              <Share2 className="w-6 h-6 text-gray-600 group-hover:text-primary-500 transition-colors" />
            </button>
          </div>

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

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
      />
    </>
  );
};

export default PostCard;
