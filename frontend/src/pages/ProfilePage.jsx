import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Edit, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import PostCard from '../components/posts/PostCard';
import EditProfileModal from '../components/profile/EditProfileModal';
import { logout, updateUser } from '../store/slices/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock user posts
  const userPosts = [
    {
      _id: 'profile-1',
      author: { username: user?.username, avatar: user?.avatar },
      content: 'Just joined ToriLynq! Excited to share my stories 🎉 #NewHere #ToriLynq',
      images: [],
      hashtags: ['NewHere', 'ToriLynq'],
      likesCount: 15,
      commentsCount: 3,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.put('/users/profile', updatedData);
      
      // Update Redux store immediately (optimistic update)
      dispatch(updateUser(updatedData));
      
      console.log('Profile updated:', updatedData);
      
      // Show success message
      // You can replace alert with a toast notification later
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
      throw error;
    }
  };

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Profile Header */}
        <div className="border-b border-gray-200">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600"></div>
          
          {/* Profile Info */}
          <div className="px-4 pb-4">
            {/* Avatar */}
            <div className="relative -mt-20 mb-4">
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150'}
                alt={user?.username}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">@{user?.username}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 mb-4">{user?.bio || 'No bio yet'}</p>

            {/* Stats */}
            <div className="flex space-x-6 mb-4">
              <div>
                <span className="font-bold text-gray-900">{userPosts.length}</span>
                <span className="text-gray-600 ml-1">posts</span>
              </div>
              <button className="hover:underline">
                <span className="font-bold text-gray-900">{user?.followers?.length || 0}</span>
                <span className="text-gray-600 ml-1">followers</span>
              </button>
              <button className="hover:underline">
                <span className="font-bold text-gray-900">{user?.following?.length || 0}</span>
                <span className="text-gray-600 ml-1">following</span>
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{user?.location || 'Location not set'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {user?.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'recently'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${
                activeTab === 'posts'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${
                activeTab === 'media'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${
                activeTab === 'likes'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Likes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="divide-y divide-gray-200">
          {activeTab === 'posts' && (
            <>
              {userPosts.length > 0 ? (
                userPosts.map((post) => <PostCard key={post._id} post={post} />)
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No posts yet</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'media' && (
            <div className="p-8 text-center text-gray-500">
              <p>No media posts yet</p>
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="p-8 text-center text-gray-500">
              <p>No liked posts yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </ResponsiveLayout>
  );
};

export default ProfilePage;