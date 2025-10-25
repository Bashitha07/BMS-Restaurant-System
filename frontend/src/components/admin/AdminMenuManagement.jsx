import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Upload, Save, X, Search, Filter, Eye, ToggleLeft, ToggleRight, Camera, FileImage, Link2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FoodImage from '../common/FoodImage';
import { getBestMatchImage } from '../../utils/specificFoodImages';
import { menuItems as staticMenuItems } from '../../data/menuData';
import adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';

const AdminMenuManagement = () => {
  const { isAdmin } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Pasta',
    available: true,
    image: '',
    portion: '',
    prepTime: '',
    rating: 4.5,
    ingredients: '',
    nutritionalInfo: '',
    preparationMethod: ''
  });

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadMethod, setImageUploadMethod] = useState('url'); // 'file' or 'url'
  const fileInputRef = useRef(null);

  const categories = ['Pasta', 'Salads', 'Burgers', 'Rice', 'Noodles', 'Submarines', 'Bites', 'Fresh Juice', 'Desserts', 'Main Course'];

  useEffect(() => {
    initializeMenuItems();
  }, [isAdmin]);

  const initializeMenuItems = async () => {
    try {
      setLoading(true);
      // Only try to fetch from API if user is admin
      if (isAdmin) {
        try {
          const data = await adminService.getAllMenuItems();
          setMenuItems(data);
        } catch (apiError) {
          // Fallback to static menu items
          setMenuItems(staticMenuItems);
          console.log('Using static menu data as fallback');
        }
      } else {
        // Use static menu items for non-admin users
        setMenuItems(staticMenuItems);
        console.log('Using static menu data for non-admin user');
      }
    } catch (err) {
      setError('Failed to fetch menu items');
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  // Filter menu items based on search and category
  useEffect(() => {
    let filtered = menuItems;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(filtered);
  }, [menuItems, searchTerm, selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        id: editingItem ? editingItem.id : Date.now().toString(),
        // Use specific image if available, otherwise suggest one
        image: formData.image || getBestMatchImage(formData.name, formData.category)
      };

      if (editingItem) {
        // Update existing item
        setMenuItems(prev => prev.map(item => 
          item.id === editingItem.id ? submitData : item
        ));
        toast.success('Menu item updated successfully!');
        
        // Try to update via API as well
        try {
          await adminService.updateMenuItem(editingItem.id, submitData);
        } catch (apiError) {
          console.log('API update failed, using local update only');
        }
      } else {
        // Add new item
        setMenuItems(prev => [submitData, ...prev]);
        toast.success('Menu item added successfully!');
        
        // Try to create via API as well
        try {
          await adminService.createMenuItem(submitData);
        } catch (apiError) {
          console.log('API create failed, using local creation only');
        }
      }
      
      resetForm();
    } catch (err) {
      toast.error(editingItem ? 'Failed to update menu item' : 'Failed to create menu item');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price?.toString() || '',
      category: item.category || 'Pasta',
      available: item.isAvailable ?? true,
      image: item.imageUrl || '',
      portion: item.portion || '',
      prepTime: item.prepTime || '',
      rating: item.rating || 4.5,
      ingredients: item.ingredients || '',
      nutritionalInfo: item.nutritionalInfo || '',
      preparationMethod: item.preparationMethod || ''
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Pasta',
      available: true,
      image: '',
      portion: '',
      prepTime: '',
      rating: 4.5
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        // Remove from local state
        setMenuItems(prev => prev.filter(item => item.id !== id));
        toast.success('Menu item deleted successfully!');
        
        // Try to delete via API as well
        try {
          await adminService.deleteMenuItem(id);
        } catch (apiError) {
          console.log('API delete failed, using local deletion only');
        }
      } catch (err) {
        toast.error('Failed to delete menu item');
        console.error('Error:', err);
      }
    }
  };

  const toggleAvailability = async (id) => {
    const item = menuItems.find(item => item.id === id);
    const newAvailability = !item.isAvailable;
    
    // Optimistically update UI
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: newAvailability } : item
    ));
    
    // Try to update via API
    try {
      await adminService.updateMenuAvailability(id, newAvailability);
      toast.success(`Menu item ${newAvailability ? 'enabled' : 'disabled'}`);
    } catch (apiError) {
      console.log('API update failed, using local update only');
      // Revert on failure
      setMenuItems(prev => prev.map(item => 
        item.id === id ? { ...item, isAvailable: !newAvailability } : item
      ));
      toast.error('Failed to update menu availability');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Pasta',
      available: true,
      image: '',
      portion: '',
      prepTime: '',
      rating: 4.5,
      ingredients: '',
      nutritionalInfo: '',
      preparationMethod: ''
    });
    clearImage();
    setEditingItem(null);
    setShowForm(false);
    setImageUploadMethod('url');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-suggest image when name or category changes
      if (field === 'name' || field === 'category') {
        const suggestedImage = getBestMatchImage(updated.name, updated.category);
        if (suggestedImage && !updated.image) {
          updated.image = suggestedImage;
        }
      }
      
      return updated;
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  // Image handling functions
  const handleImageFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image file size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error('Please select an image file first');
      return;
    }

    setUploadingImage(true);
    try {
      // Pass menuId if editing an existing item
      const menuId = editingItem?.id || null;
      const response = await adminService.uploadMenuImage(imageFile, menuId);
      const uploadedUrl = response.imageUrl;
      setFormData(prev => ({ ...prev, image: uploadedUrl }));
      toast.success(`Image uploaded successfully!${menuId ? ` (menu_image_no${menuId})` : ''}`);
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get unique categories for filter
  const availableCategories = ['All', ...new Set(menuItems.map(item => item.category))];

  if (loading && !menuItems.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Menu Item
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="text-blue-600 text-xl">🍽️</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{menuItems.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="text-green-600 text-xl">✅</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-semibold text-gray-900">
                {menuItems.filter(item => item.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <div className="text-orange-600 text-xl">📊</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">{availableCategories.length - 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Menu Items ({filteredItems.length})
          </h3>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first menu item'}
            </p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Menu Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <FoodImage 
                    foodName={item.name}
                    category={item.category}
                    imageUrl={item.imageUrl}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-lg font-bold text-blue-600 ml-2">
                      LKR {item.price?.toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    {item.portion && (
                      <span>{item.portion}</span>
                    )}
                    {item.prepTime && (
                      <span>{item.prepTime}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.isAvailable
                          ? 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                          : 'bg-green-50 hover:bg-green-100 text-green-700'
                      }`}
                    >
                      {item.isAvailable ? 'Disable' : 'Enable'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Creamy Chicken Alfredo"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Salads">Salads</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Rice & Noodles">Rice & Noodles</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1350.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portion Size
                  </label>
                  <input
                    type="text"
                    value={formData.portion}
                    onChange={(e) => handleInputChange('portion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Serves 1-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Time
                  </label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => handleInputChange('prepTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15-20 minutes"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Image
                  </label>
                  
                  {/* Image Upload Method Toggle */}
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod('url')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        imageUploadMethod === 'url' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      <Link2 className="h-4 w-4" />
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod('file')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        imageUploadMethod === 'file' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      <Camera className="h-4 w-4" />
                      Upload File
                    </button>
                  </div>

                  {/* URL Input Method */}
                  {imageUploadMethod === 'url' && (
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg or leave empty for auto-suggestion"
                        />
                        <Link2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500">
                        Paste an image URL or leave empty for automatic image suggestion based on food name
                      </p>
                    </div>
                  )}

                  {/* File Upload Method */}
                  {imageUploadMethod === 'file' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageFileSelect}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-gray-700 transition-colors"
                        >
                          <FileImage className="h-4 w-4" />
                          Choose Image File
                        </button>
                        {imageFile && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{imageFile.name}</span>
                            <button
                              type="button"
                              onClick={clearImage}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {imageFile && !formData.image && (
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                        >
                          {uploadingImage ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </button>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        Supported formats: JPG, PNG, GIF (Max size: 5MB)
                      </p>
                    </div>
                  )}

                  {/* Image Preview */}
                  {(formData.image || imagePreview) && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Image Preview</span>
                        <button
                          type="button"
                          onClick={clearImage}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <img 
                        src={formData.image || imagePreview} 
                        alt="Food preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src = getBestMatchImage(formData.name, formData.category);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the dish, ingredients, and what makes it special..."
                    required
                  />
                </div>

                {/* Additional Fields */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) => handleInputChange('ingredients', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List main ingredients (e.g., Chicken breast, Pasta, Garlic, Cream, Parmesan cheese)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nutritional Info
                  </label>
                  <input
                    type="text"
                    value={formData.nutritionalInfo}
                    onChange={(e) => handleInputChange('nutritionalInfo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 25g protein, 30g carbs, 15g fat"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => handleInputChange('available', e.target.checked)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Available for orders</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuManagement;