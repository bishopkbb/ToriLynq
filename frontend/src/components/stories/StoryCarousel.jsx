import React from 'react';
import { Plus } from 'lucide-react';
import { useSelector } from 'react-redux';

const StoryCarousel = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock stories data (will be replaced with real data from API)
  const stories = [
    { id: 1, username: 'Sotimy', avatar: 'https://i.pravatar.cc/150?img=1', hasNewStory: true },
    { id: 2, username: 'Retumics', avatar: 'https://i.pravatar.cc/150?img=2', hasNewStory: true },
    { id: 3, username: 'Corrapdimr', avatar: 'https://i.pravatar.cc/150?img=3', hasNewStory: true },
    { id: 4, username: 'Sharte', avatar: 'https://i.pravatar.cc/150?img=4', hasNewStory: false },
    { id: 5, username: 'Roomtaline', avatar: 'https://i.pravatar.cc/150?img=5', hasNewStory: false },
  ];

  return (
    <div className="bg-white py-4 border-b border-gray-200">
      <div className="max-w-lg mx-auto px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Story Highlights</h2>
        
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {/* Add Story Button */}
          <div className="flex flex-col items-center space-y-1 flex-shrink-0">
            <button className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center hover:scale-105 transition-transform">
              <Plus className="w-8 h-8 text-white" />
            </button>
            <span className="text-xs text-gray-600 font-medium">Your Story</span>
          </div>

          {/* Story Items */}
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  story.hasNewStory
                    ? 'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500'
                    : 'bg-gray-300'
                }`}
              >
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                />
              </div>
              <span className="text-xs text-gray-600 font-medium max-w-[64px] truncate">
                {story.username}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryCarousel;
