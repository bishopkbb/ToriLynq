import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Image as ImageIcon, Smile, MapPin, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { createPost } from '../../store/slices/postsSlice';

const CreatePostModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.posts);
  
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    // Add new images
    setImages([...images, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && images.length === 0) {
      alert('Please add some content or images');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await dispatch(createPost(formData)).unwrap();
      
      // Reset and close
      setContent('');
      setImages([]);
      setImagePreviews([]);
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 p-4">
          <img
            src={user?.avatar || 'https://i.pravatar.cc/150'}
            alt={user?.username}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900">@{user?.username}</p>
            <p className="text-sm text-gray-500">Public</p>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[120px] text-lg resize-none focus:outline-none"
            autoFocus
          />

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Add to your post</p>
            
            <div className="flex items-center space-x-2">
              {/* Image Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Add images"
              >
                <ImageIcon className="w-6 h-6 text-primary-500" />
              </button>

              {/* Emoji (placeholder) */}
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Add emoji"
              >
                <Smile className="w-6 h-6 text-yellow-500" />
              </button>

              {/* Location (placeholder) */}
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Add location"
              >
                <MapPin className="w-6 h-6 text-red-500" />
              </button>
            </div>
          </div>

          {/* Hashtag Suggestions */}
          {content && (
            <div className="text-sm text-gray-500">
              💡 Tip: Use hashtags like #ToriLynq #GhanaLove to reach more people
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || (!content.trim() && images.length === 0)}
            loading={isLoading}
            className="w-full"
          >
            Post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
