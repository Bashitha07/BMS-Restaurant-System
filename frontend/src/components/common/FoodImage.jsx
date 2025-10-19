import React, { useState, useEffect } from 'react';
import { getBestMatchImage, validateImageWithRetry, getFallbackImage } from '../utils/specificFoodImages';

const FoodImage = ({ 
  src, 
  alt, 
  category,
  itemName,
  className = '', 
  fallbackClassName = '',
  loading = 'lazy',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const checkImage = async () => {
      setIsLoading(true);
      setHasError(false);
      
      // First try the original image with enhanced validation
      const isValid = await validateImageWithRetry(src);
      
      if (!isValid) {
        // If original fails, use best match (specific food or consistent category image)
        const bestMatchImage = itemName && category ? 
          getBestMatchImage(itemName, category) : 
          getFallbackImage(category);
        setImageSrc(bestMatchImage);
        setHasError(true);
        console.warn(`Failed to load image: ${src}, using best match for ${itemName} in category: ${category}`);
      }
      
      setIsLoading(false);
    };

    if (src) {
      checkImage();
    }
  }, [src, category, itemName]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    if (!hasError) {
      // Try best match (specific food or consistent category image)
      const bestMatchImage = itemName && category ? 
        getBestMatchImage(itemName, category) : 
        getFallbackImage(category);
      setImageSrc(bestMatchImage);
      setHasError(true);
      console.warn(`Image failed to load: ${src}, using best match for ${itemName} in category: ${category}`);
    }
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${hasError ? fallbackClassName : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={loading}
        {...props}
      />
      {hasError && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
          Using fallback image
        </div>
      )}
    </div>
  );
};

export default FoodImage;