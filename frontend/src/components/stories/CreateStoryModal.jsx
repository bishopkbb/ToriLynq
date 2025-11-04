import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Camera, Image as ImageIcon } from 'lucide-react';
import Button from '../common/Button';
import { createStory } from '../../store/slices/storiesSlice';

const CreateStoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.stories);
  
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image for your story');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    if (caption.trim()) {
      formData.append('caption', caption);
    }

    try {
      await dispatch(createStory(formData)).unwrap();
      
      // Reset and close
      setCaption('');
      setImage(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error('Failed to create story:', error);
      alert('Failed to create story. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create Story</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Image Preview or Upload */}
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Story preview"
                className="w-full h-96 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center space-y-2 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <ImageIcon className="w-12 h-12 text-primary-500" />
                    <span className="text-sm font-medium text-primary-600">Choose Photo</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      // Camera functionality would go here
                      alert('Camera feature coming soon! Please choose a photo for now.');
                    }}
                    className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Camera className="w-12 h-12 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">Take Photo</span>
                  </button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Your story will be visible for 24 hours
                </p>
              </div>
            </div>
          )}

          {/* Caption */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption (optional)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="3"
                maxLength="200"
              />
              <p className="text-xs text-gray-500 mt-1">{caption.length}/200</p>
            </div>
          )}

          {/* Story Info */}
          {imagePreview && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150'}
                alt={user?.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">@{user?.username}</p>
                <p className="text-xs text-gray-500">Visible for 24 hours</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {imagePreview && (
            <Button
              type="submit"
              disabled={isLoading || !image}
              loading={isLoading}
              className="w-full"
            >
              Share Story
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;
