import React, { useState, useEffect } from 'react';
import FoodImage from '../components/FoodImage';
import { reliableImages, validateImageWithRetry, getConsistentImage } from '../utils/enhancedImageUtils';

const ImageDiagnostic = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testSampleImages = async () => {
    setLoading(true);
    const results = {};
    
    // Test sample images from each category
    const testImages = [
      { url: reliableImages.pasta[0], category: 'Pasta' },
      { url: reliableImages.burgers[0], category: 'Burgers' },
      { url: reliableImages.salads[0], category: 'Salads' },
      { url: reliableImages.rice[0], category: 'Rice' },
      { url: 'https://images.unsplash.com/invalid-url?w=800&h=600&q=80&fit=crop', category: 'Invalid' }
    ];
    
    for (const { url, category } of testImages) {
      try {
        const isValid = await validateImageWithRetry(url);
        results[category] = { url, isValid, status: isValid ? 'success' : 'failed' };
      } catch (error) {
        results[category] = { url, isValid: false, status: 'error', error: error.message };
      }
    }
    
    setTestResults(results);
    setLoading(false);
  };

  const testConsistentImages = () => {
    const testItems = [
      { name: 'Spaghetti Carbonara', category: 'Pasta' },
      { name: 'Grilled Chicken Burger', category: 'Burgers' },
      { name: 'Caesar Salad', category: 'Salads' },
    ];
    
    return testItems.map(item => ({
      ...item,
      image: getConsistentImage(item.name, item.category)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Image System Diagnostic</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Image Validation Tests</h2>
          <button
            onClick={testSampleImages}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Testing Images...' : 'Test Sample Images'}
          </button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Validation Results</h2>
            <div className="space-y-4">
              {Object.entries(testResults).map(([category, result]) => (
                <div key={category} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category}:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.status === 'success' ? 'bg-green-100 text-green-800' :
                      result.status === 'failed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    URL: {result.url}
                  </div>
                  {result.error && (
                    <div className="text-sm text-red-600 mt-1">
                      Error: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Consistent Image Assignment Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testConsistentImages().map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.category}</p>
                <FoodImage
                  src={item.image}
                  alt={item.name}
                  category={item.category}
                  itemName={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2 break-all">{item.image}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Live Category Images Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(reliableImages).map(([category, images]) => (
              <div key={category} className="text-center">
                <h3 className="font-medium mb-2 capitalize">{category}</h3>
                <FoodImage
                  src={images[0]}
                  alt={`${category} sample`}
                  category={category}
                  itemName={`Sample ${category}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDiagnostic;