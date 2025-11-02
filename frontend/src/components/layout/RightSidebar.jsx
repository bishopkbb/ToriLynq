import React from 'react';
import { TrendingUp, UserPlus } from 'lucide-react';

const RightSidebar = () => {
  // Mock trending data
  const trendingTopics = [
    { tag: 'GhanaLove', posts: '12.5K' },
    { tag: 'ToriLynqAdventures', posts: '8.2K' },
    { tag: 'AfricanCulture', posts: '15.3K' },
    { tag: 'NigerianFood', posts: '6.7K' },
    { tag: 'LagosLife', posts: '9.1K' },
  ];

  // Mock suggested users
  const suggestedUsers = [
    { id: 1, username: 'AfroNomad', avatar: 'https://i.pravatar.cc/150?img=20', followers: '2.5K' },
    { id: 2, username: 'CultureQueen', avatar: 'https://i.pravatar.cc/150?img=21', followers: '1.8K' },
    { id: 3, username: 'LagosBoy', avatar: 'https://i.pravatar.cc/150?img=22', followers: '3.2K' },
    { id: 4, username: 'AccraVibes', avatar: 'https://i.pravatar.cc/150?img=23', followers: '1.5K' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Trending Topics */}
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold text-gray-900">Trending Now</h2>
        </div>
        
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <button
              key={index}
              className="w-full text-left hover:bg-white p-3 rounded-lg transition-colors"
            >
              <p className="text-sm text-gray-500">#{index + 1} Trending</p>
              <p className="font-semibold text-gray-900">#{topic.tag}</p>
              <p className="text-sm text-gray-500">{topic.posts} posts</p>
            </button>
          ))}
        </div>

        <button className="w-full text-primary-500 text-sm font-semibold mt-4 hover:underline">
          Show more
        </button>
      </div>

      {/* Suggested Users */}
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center space-x-2 mb-4">
          <UserPlus className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold text-gray-900">Who to Follow</h2>
        </div>

        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">@{user.username}</p>
                  <p className="text-sm text-gray-500">{user.followers} followers</p>
                </div>
              </div>
              <button className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>

        <button className="w-full text-primary-500 text-sm font-semibold mt-4 hover:underline">
          Show more
        </button>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-gray-500 space-y-2 px-4">
        <div className="flex flex-wrap gap-3">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
        </div>
        <p>© 2025 ToriLynq. All rights reserved.</p>
      </div>
    </div>
  );
};

export default RightSidebar;
