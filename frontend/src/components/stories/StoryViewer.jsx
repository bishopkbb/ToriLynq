import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { deleteStory, viewStory } from '../../store/slices/storiesSlice';

const StoryViewer = ({ isOpen, onClose, initialStoryGroup, allStoryGroups }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const storyDuration = 5000; // 5 seconds per story

  useEffect(() => {
    // Find initial group index
    if (initialStoryGroup && allStoryGroups) {
      const index = allStoryGroups.findIndex(
        group => group.author._id === initialStoryGroup.author._id
      );
      if (index !== -1) setCurrentGroupIndex(index);
    }
  }, [initialStoryGroup, allStoryGroups]);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const currentGroup = allStoryGroups?.[currentGroupIndex];
    const currentStory = currentGroup?.stories[currentStoryIndex];

    if (!currentStory) return;

    // Mark story as viewed
    if (!currentStory._id?.startsWith('mock-')) {
      dispatch(viewStory(currentStory._id));
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Move to next story
          goToNextStory();
          return 0;
        }
        return prev + (100 / (storyDuration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentGroupIndex, currentStoryIndex]);

  const goToNextStory = () => {
    const currentGroup = allStoryGroups?.[currentGroupIndex];
    
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      // Next story in same group
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentGroupIndex < allStoryGroups.length - 1) {
      // Next group
      setCurrentGroupIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      // End of all stories
      onClose();
    }
  };

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentGroupIndex > 0) {
      const prevGroup = allStoryGroups[currentGroupIndex - 1];
      setCurrentGroupIndex(prev => prev - 1);
      setCurrentStoryIndex(prevGroup.stories.length - 1);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    const currentGroup = allStoryGroups?.[currentGroupIndex];
    const currentStory = currentGroup?.stories[currentStoryIndex];
    
    if (!window.confirm('Delete this story?')) return;

    try {
      await dispatch(deleteStory(currentStory._id)).unwrap();
      
      // Move to next story or close if last
      if (currentGroup.stories.length === 1) {
        onClose();
      } else {
        goToNextStory();
      }
    } catch (error) {
      alert('Failed to delete story');
    }
  };

  if (!isOpen || !allStoryGroups || allStoryGroups.length === 0) return null;

  const currentGroup = allStoryGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];
  const isOwner = user?._id === currentGroup?.author?._id;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-colors z-10"
      >
        <X className="w-8 h-8 text-white" />
      </button>

      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
        {currentGroup?.stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentStoryIndex ? '100%' : index === currentStoryIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Header */}
      <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <img
            src={currentGroup?.author?.avatar}
            alt={currentGroup?.author?.username}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-white font-semibold">@{currentGroup?.author?.username}</p>
            <p className="text-white text-xs opacity-75">
              {currentStory?.createdAt && formatDistanceToNow(new Date(currentStory.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Menu */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-colors"
            >
              <MoreVertical className="w-6 h-6 text-white" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Story</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Previous Button */}
      {(currentGroupIndex > 0 || currentStoryIndex > 0) && (
        <button
          onClick={goToPreviousStory}
          className="absolute left-4 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-colors z-10"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Story Image */}
      <div
        className="relative w-full max-w-md h-full flex items-center justify-center cursor-pointer"
        onClick={() => setIsPaused(!isPaused)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <img
          src={currentStory?.image || 'https://via.placeholder.com/400x700'}
          alt="Story"
          className="w-full h-full object-contain"
        />

        {/* Caption */}
        {currentStory?.caption && (
          <div className="absolute bottom-8 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-4">
            <p className="text-white text-sm">{currentStory.caption}</p>
          </div>
        )}

        {/* Paused Indicator */}
        {isPaused && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
              <div className="w-3 h-8 bg-white rounded-sm mx-1"></div>
              <div className="w-3 h-8 bg-white rounded-sm mx-1"></div>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      {(currentGroupIndex < allStoryGroups.length - 1 || currentStoryIndex < currentGroup?.stories.length - 1) && (
        <button
          onClick={goToNextStory}
          className="absolute right-4 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-colors z-10"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}
    </div>
  );
};

export default StoryViewer;
