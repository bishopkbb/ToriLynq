import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';
import Button from '../common/Button';

const EditPostModal = ({ isOpen, onClose, post }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.posts);
  
  const [content, setContent] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  // Initialize form with post data
  useEffect(() => {
    if (post) {
      setContent(post.content || '');
      setExistingImages(post.images || []);
    }
  }, [post]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) {
      alert('You can only have up to 5 images total');
      return;
    }

    setNewImages([...newImages, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && existingImages.length === 0 && newImages.length === 0) {
      alert('Please add some content or images');
      return;
    }

    // For now, just show alert - we'll implement API call later
    alert('Edit post feature will be implemented when backend endpoint is ready. For now, delete and create a new post.');
    onClose();

    // TODO: Implement when backend has edit endpoint
    // const formData = new FormData();
    // formData.append('content', content);
    // existingImages.forEach((image) => {
    //   formData.append('existingImages', image);
    // });
    // newImages.forEach((image) => {
    //   formData.append('newImages', image);
    // });
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[120px] text-lg resize-none focus:outline-none border border-gray-200 rounded-lg p-3"
            autoFocus
          />

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
              <div className="grid grid-cols-2 gap-2">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Current ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Previews */}
          {newImagePreviews.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">New Images:</p>
              <div className="grid grid-cols-2 gap-2">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Images Button */}
          {(existingImages.length + newImages.length) < 5 && (
            <div>
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
                className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors w-full"
              >
                <ImageIcon className="w-5 h-5 text-primary-500" />
                <span className="text-gray-600">Add more images ({5 - existingImages.length - newImages.length} remaining)</span>
              </button>
            </div>
          )}

          {/* Info Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ℹ️ Note: Edit functionality requires backend API update. For now, please delete and create a new post if you need to make changes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (!content.trim() && existingImages.length === 0 && newImages.length === 0)}
              loading={isLoading}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
