import React from 'react';
import { Users, Plus } from 'lucide-react';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';

const CommunitiesPage = () => {
  // Mock communities
  const communities = [
    {
      id: 1,
      name: 'Nigerian Food Lovers',
      description: 'Share and discover amazing Nigerian recipes',
      members: '12.5K',
      avatar: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200',
      isJoined: true,
    },
    {
      id: 2,
      name: 'African Travel',
      description: 'Explore the beauty of Africa together',
      members: '8.3K',
      avatar: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=200',
      isJoined: true,
    },
    {
      id: 3,
      name: 'Lagos Tech Hub',
      description: 'Connect with tech enthusiasts in Lagos',
      members: '15.7K',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
      isJoined: false,
    },
  ];

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
              <p className="text-sm text-gray-600 mt-1">Join communities that interest you</p>
            </div>
            <button className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Communities List */}
        <div className="p-4 space-y-4">
          {communities.map(community => (
            <div
              key={community.id}
              className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{community.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{community.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{community.members} members</span>
                  </div>
                  
                  {community.isJoined ? (
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-colors">
                      Joined
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-600 transition-colors">
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default CommunitiesPage;
