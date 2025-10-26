import React, { useState, useEffect, useRef } from 'react';

// Placeholder image - simple 1px transparent GIF
const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const FoodImage = ({ 
  src, 
  alt, 
  category,
  itemName,
  foodName, // Support for legacy prop
  imageUrl, // Support for legacy prop
  className = '', 
  fallbackClassName = '',
  loading = 'lazy',
  ...props 
}) => {
  // Handle compatibility with both naming conventions
  const effectiveItemName = itemName || foodName || '';
  const effectiveSrc = src || imageUrl || '';
  
  console.log('[FoodImage] Props received:', { src, imageUrl, effectiveSrc, itemName: effectiveItemName });
  
  const [imageSrc, setImageSrc] = useState(effectiveSrc || PLACEHOLDER_IMAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const currentUrlRef = useRef(effectiveSrc);

  useEffect(() => {
    // Only update if the URL actually changed
    if (effectiveSrc !== currentUrlRef.current) {
      console.log('[FoodImage] effectiveSrc changed from', currentUrlRef.current, 'to', effectiveSrc);
      currentUrlRef.current = effectiveSrc;
      
      if (effectiveSrc) {
        setImageSrc(effectiveSrc);
        setIsLoading(true);
        setHasError(false);
      } else {
        setImageSrc(PLACEHOLDER_IMAGE);
        setIsLoading(false);
        setHasError(true);
      }
    }
  }, [effectiveSrc]);

  const handleImageLoad = () => {
    console.log('[FoodImage] Image loaded successfully:', imageSrc);
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    console.log('[FoodImage] Image failed to load:', imageSrc);
    // Only show placeholder, no fallback images
    setImageSrc(PLACEHOLDER_IMAGE);
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && effectiveSrc && effectiveSrc !== PLACEHOLDER_IMAGE && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt || effectiveItemName || 'Food item'}
        className={`${className} ${hasError ? fallbackClassName : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={loading}
        {...props}
      />
      {hasError && effectiveSrc && effectiveSrc !== PLACEHOLDER_IMAGE && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-75 text-white text-xs p-1 text-center">
          Image not found
        </div>
      )}
    </div>
  );
};

export default FoodImage;