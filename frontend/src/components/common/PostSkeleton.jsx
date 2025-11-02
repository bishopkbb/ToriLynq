import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>

      {/* Image placeholder */}
      <div className="w-full h-64 bg-gray-300 rounded-lg mb-3"></div>

      {/* Actions */}
      <div className="flex space-x-6">
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;
