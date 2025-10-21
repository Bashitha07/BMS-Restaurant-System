import React, { useState, useEffect } from 'react';
import { getBestMatchImage, validateImageWithRetry, getFallbackImage } from '../../utils/specificFoodImages';

// Try to dynamically import images from assets directory
const getLocalAssetImage = (category, itemName) => {
  let categoryFolder = '';
  
  // Determine category folder
  switch (category?.toLowerCase()) {
    case 'beverage':
    case 'beverages':
    case 'drinks':
      categoryFolder = 'beverages';
      break;
    case 'dessert':
    case 'desserts':
    case 'sweets':
      categoryFolder = 'desserts';
      break;
    case 'food':
    case 'main':
    case 'main dish':
    case 'main course':
    default:
      categoryFolder = 'food';
      break;
  }
  
  // Check if the image path starts with /assets/images/ (locally uploaded)
  // If it does, return as is since it's already a local asset path
  if (itemName?.startsWith('/assets/images/')) {
    return itemName;
  }
  
  return null; // No local asset match found
};

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
  
  const [imageSrc, setImageSrc] = useState(effectiveSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const checkImage = async () => {
      setIsLoading(true);
      setHasError(false);
      
      // First check if the src is a local asset path
      if (effectiveSrc && effectiveSrc.startsWith('/assets/images/')) {
        setImageSrc(effectiveSrc);
        setIsLoading(false);
        return;
      }
      
      // Otherwise try to get a local asset based on category and name
      const localAsset = getLocalAssetImage(category, effectiveItemName);
      if (localAsset) {
        setImageSrc(localAsset);
        setIsLoading(false);
        return;
      }
      
      // If no local asset, try the original image with enhanced validation
      const isValid = await validateImageWithRetry(effectiveSrc);
      
      if (!isValid) {
        // If original fails, use best match (specific food or consistent category image)
        const bestMatchImage = effectiveItemName && category ? 
          getBestMatchImage(effectiveItemName, category) : 
          getFallbackImage(category);
        setImageSrc(bestMatchImage);
        setHasError(true);
        console.warn(`Failed to load image: ${effectiveSrc}, using best match for ${effectiveItemName} in category: ${category}`);
      }
      
      setIsLoading(false);
    };

    if (effectiveSrc) {
      checkImage();
    }
  }, [effectiveSrc, category, effectiveItemName]);

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