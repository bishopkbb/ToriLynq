import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ images }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Different layouts based on number of images
  const getGridClass = () => {
    switch (images.length) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2';
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-2';
    }
  };

  const getImageClass = (index) => {
    const total = images.length;
    
    if (total === 1) return 'col-span-1 row-span-1 h-96';
    if (total === 2) return 'col-span-1 row-span-1 h-64';
    if (total === 3) {
      return index === 0 ? 'col-span-2 row-span-1 h-64' : 'col-span-1 row-span-1 h-48';
    }
    if (total === 4) return 'col-span-1 row-span-1 h-48';
    if (total >= 5) {
      if (index < 3) return 'col-span-1 row-span-1 h-48';
      return 'col-span-1 row-span-1 h-32';
    }
  };

  return (
    <>
      {/* Image Grid */}
      <div className={`grid ${getGridClass()} gap-1`}>
        {images.slice(0, 5).map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden cursor-pointer group ${getImageClass(index)}`}
            onClick={() => openLightbox(index)}
          >
            <img
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
            
            {/* Show count on last image if more than 5 */}
            {index === 4 && images.length > 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">+{images.length - 5}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors z-10"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
            <span className="text-white font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Current Image */}
          <div className="max-w-5xl max-h-[90vh] px-16">
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto max-w-full px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex ? 'border-primary-500 scale-110' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
