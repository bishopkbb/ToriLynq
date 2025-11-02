import React from 'react';
import { PlusCircle, Image, Video, Smile } from 'lucide-react';

const CreatePostButton = ({ onClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onClick}
          className="w-full flex items-center space-x-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-left"
        >
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-500 flex-1">What's on your mind?</span>
          
          {/* Quick action icons */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className="p-2 hover:bg-gray-300 rounded-full transition-colors">
              <Image className="w-5 h-5 text-primary-500" />
            </div>
            <div className="p-2 hover:bg-gray-300 rounded-full transition-colors">
              <Video className="w-5 h-5 text-red-500" />
            </div>
            <div className="p-2 hover:bg-gray-300 rounded-full transition-colors">
              <Smile className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CreatePostButton;
