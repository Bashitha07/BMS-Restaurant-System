// Enhanced image utility functions with better reliability and caching

// Reliable stock food images with consistent format
export const reliableImages = {
  // Pasta dishes
  pasta: [
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800&h=600&q=80&fit=crop',
  ],
  
  // Salads
  salads: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&h=600&q=80&fit=crop',
  ],
  
  // Burgers
  burgers: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1606755962773-d324e2d53610?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&q=80&fit=crop',
  ],
  
  // Rice dishes
  rice: [
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&q=80&fit=crop',
  ],
  
  // Noodles
  noodles: [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&h=600&q=80&fit=crop',
  ],
  
  // Submarines/Sandwiches
  submarines: [
    'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=600&q=80&fit=crop',
  ],
  
  // Bites/Appetizers
  bites: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1623656625082-6ecd3d2ccb56?w=800&h=600&q=80&fit=crop',
  ],
  
  // Fresh Juice
  juice: [
    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&q=80&fit=crop',
  ],
  
  // Desserts
  desserts: [
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&q=80&fit=crop',
  ],
  
  // Main Course
  mainCourse: [
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=800&h=600&q=80&fit=crop',
  ],
};

// Create a hash-based image selection to ensure consistency
export const getConsistentImage = (itemName, category) => {
  const categoryKey = getCategoryKey(category);
  const images = reliableImages[categoryKey] || reliableImages.mainCourse;
  
  // Create a simple hash from the item name to consistently select an image
  let hash = 0;
  for (let i = 0; i < itemName.length; i++) {
    const char = itemName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const imageIndex = Math.abs(hash) % images.length;
  return images[imageIndex];
};

// Map category names to image keys
export const getCategoryKey = (category) => {
  const categoryMap = {
    'Pasta': 'pasta',
    'Salads': 'salads',
    'Burgers': 'burgers',
    'Rice': 'rice',
    'Noodles': 'noodles',
    'Submarines': 'submarines',
    'Bites': 'bites',
    'Fresh Juice': 'juice',
    'Desserts': 'desserts',
    'Main Course': 'mainCourse',
  };
  
  return categoryMap[category] || 'mainCourse';
};

// Enhanced image validation with retry mechanism
export const validateImageWithRetry = async (url, maxRetries = 2) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const isValid = await new Promise((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => resolve(false), 3000); // 3 second timeout
        
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
      
      if (isValid) return true;
      
      // Wait before retry
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.warn(`Image validation attempt ${attempt + 1} failed:`, error);
    }
  }
  
  return false;
};

// Preload critical images for better performance
export const preloadCriticalImages = () => {
  const criticalImages = [
    reliableImages.pasta[0],
    reliableImages.salads[0],
    reliableImages.burgers[0],
    reliableImages.rice[0],
    reliableImages.noodles[0],
    reliableImages.submarines[0],
    reliableImages.bites[0],
    reliableImages.juice[0],
    reliableImages.desserts[0],
    reliableImages.mainCourse[0],
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Export legacy compatibility
export { reliableImages as fallbackImages };
export const getFallbackImage = (category) => {
  const categoryKey = getCategoryKey(category);
  const images = reliableImages[categoryKey] || reliableImages.mainCourse;
  return images[0]; // Return first image as fallback
};