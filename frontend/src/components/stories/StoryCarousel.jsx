import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { fetchStories } from '../../store/slices/storiesSlice';
import CreateStoryModal from './CreateStoryModal';
import StoryViewer from './StoryViewer';

const StoryCarousel = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stories, isLoading } = useSelector((state) => state.stories);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState(null);

  // Mock stories as fallback
  const mockStories = [
    { 
      author: { _id: '1', username: 'Sotimy', avatar: 'https://i.pravatar.cc/150?img=1' },
      stories: [{ _id: 'mock-1', image: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=400', hasNewStory: true }]
    },
    { 
      author: { _id: '2', username: 'Retumics', avatar: 'https://i.pravatar.cc/150?img=2' },
      stories: [{ _id: 'mock-2', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400', hasNewStory: true }]
    },
    { 
      author: { _id: '3', username: 'Corrapdimr', avatar: 'https://i.pravatar.cc/150?img=3' },
      stories: [{ _id: 'mock-3', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400', hasNewStory: true }]
    },
  ];

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const displayStories = stories.length > 0 ? stories : mockStories;

  const handleStoryClick = (storyGroup) => {
    setSelectedStoryGroup(storyGroup);
    setShowStoryViewer(true);
  };

  return (
    <>
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Story Highlights</h2>
          
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {/* Add Story Button */}
            <div className="flex flex-col items-center space-y-1 flex-shrink-0">
              <button
                onClick={() => setShowCreateStory(true)}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                <Plus className="w-8 h-8 text-white" />
              </button>
              <span className="text-xs text-gray-600 font-medium">Your Story</span>
            </div>

            {/* Story Items */}
            {displayStories.map((group, index) => {
              const hasNewStory = group.stories.some(s => s.hasNewStory !== false);
              
              return (
                <div
                  key={group.author?._id || index}
                  onClick={() => handleStoryClick(group)}
                  className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer group"
                >
                  <div
                    className={`w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                      hasNewStory
                        ? 'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    <img
                      src={group.author?.avatar || 'https://i.pravatar.cc/150'}
                      alt={group.author?.username}
                      className="w-full h-full rounded-full border-2 border-white object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-medium max-w-[64px] truncate">
                    {group.author?.username || 'User'}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex-shrink-0 animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div className="h-3 bg-gray-300 rounded w-12 mt-1"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={showCreateStory}
        onClose={() => setShowCreateStory(false)}
      />

      {/* Story Viewer */}
      <StoryViewer
        isOpen={showStoryViewer}
        onClose={() => setShowStoryViewer(false)}
        initialStoryGroup={selectedStoryGroup}
        allStoryGroups={displayStories}
      />
    </>
  );
};

export default StoryCarousel;
