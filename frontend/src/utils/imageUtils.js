// Image utility functions for handling fallbacks and loading states

// Fallback food images - reliable stock photos with simpler URLs
export const fallbackImages = {
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  rice: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80',
  noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
  submarine: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800&q=80',
  bites: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80',
  juice: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
  mainCourse: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
  default: '/placeholder-food.svg'
};

// Get fallback image based on category
export const getFallbackImage = (category) => {
  const categoryMap = {
    'Pasta': fallbackImages.pasta,
    'Salads': fallbackImages.salad,
    'Burgers': fallbackImages.burger,
    'Rice': fallbackImages.rice,
    'Noodles': fallbackImages.noodles,
    'Submarines': fallbackImages.submarine,
    'Bites': fallbackImages.bites,
    'Fresh Juice': fallbackImages.juice,
    'Desserts': fallbackImages.dessert,
    'Main Course': fallbackImages.mainCourse,
  };
  
  return categoryMap[category] || fallbackImages.default;
};

// Create a more reliable image URL with simplified parameters
export const createReliableImageUrl = (photoId, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 80
  } = options;
  
  // Use simpler URL format that's more reliable
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&q=${quality}`;
};

// Validate if an image URL is accessible
export const validateImageUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000); // 5 second timeout
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    img.src = url;
  });
};

// Legacy support
export const IMAGE_PATHS = {
  FOOD: '/src/assets/images/food',
  BEVERAGES: '/src/assets/images/beverages',
  DESSERTS: '/src/assets/images/desserts',
};

export const getImageUrl = (category, imageName) => {
  const path = IMAGE_PATHS[category.toUpperCase()];
  if (!path) {
    console.error(`Invalid category: ${category}`);
    return null;
  }
  try {
    return new URL(`${path}/${imageName}`, import.meta.url).href;
  } catch (error) {
    console.error(`Error loading image: ${imageName}`, error);
    return null;
  }
};

export const IMAGE_CATEGORIES = {
  FOOD: 'FOOD',
  BEVERAGES: 'BEVERAGES',
  DESSERTS: 'DESSERTS',
};