import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, EditIcon, TrashIcon, SaveIcon, 
  XIcon, EyeIcon, EyeOffIcon, ImageIcon 
} from 'lucide-react';
import { menuCategories } from '../../data/menuData';
import { formatPrice } from '../../utils/currency';
import { getCategoryFolder, createSlug, getFileExtension } from '../../utils/imageUtils';
import FoodImage from '../../components/common/FoodImage';
import { apiService } from '../../services/apiService';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    image: '',
    // Dietary information
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isSpicy: false,
    spiceLevel: 0,
    // Inventory management
    stockQuantity: null,
    lowStockThreshold: 10,
    // Promotions
    isFeatured: false,
    discountPercentage: 0,
    // Preparation
    preparationTime: 30
  });

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get('/api/admin/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Upload image
  const uploadImage = async () => {
    if (!imageFile) return null;
    
    // Determine the correct category for image storage
    const category = formData.category || selectedCategory || 'food';
    const categoryFolder = getCategoryFolder(category);
    
    const formDataObj = new FormData();
    formDataObj.append('file', imageFile);
    formDataObj.append('category', categoryFolder);
    
    try {
      const response = await apiService.post('/api/admin/menu/upload-image', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Add new menu item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    // Form validation
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.price) errors.price = "Price is required";
    if (!formData.category) errors.category = "Category is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    let imageUrl = formData.image;
    
    // If there's a new image file, upload it
    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) imageUrl = uploadedUrl;
    }
    
    const menuItem = {
      ...formData,
      price: parseFloat(formData.price),
      image: imageUrl
    };
    
    try {
      if (editingItem) {
        // Update existing item
        await apiService.put(`/api/admin/menu/${editingItem.id}`, menuItem);
      } else {
        // Create new item
        await apiService.post('/api/admin/menu', menuItem);
      }
      
      // Reset form and refresh menu items
      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  // Delete menu item
  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await apiService.delete(`/api/admin/menu/${id}`);
        fetchMenuItems();
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    }
  };

  // Edit menu item
  const handleEditItem = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      available: item.isAvailable,
      image: item.imageUrl || '',
      // Dietary information
      isVegetarian: item.isVegetarian || false,
      isVegan: item.isVegan || false,
      isGlutenFree: item.isGlutenFree || false,
      isSpicy: item.isSpicy || false,
      spiceLevel: item.spiceLevel || 0,
      // Inventory management
      stockQuantity: item.stockQuantity,
      lowStockThreshold: item.lowStockThreshold || 10,
      // Promotions
      isFeatured: item.isFeatured || false,
      discountPercentage: item.discountPercentage || 0,
      // Preparation
      preparationTime: item.preparationTime || 30
    });
    setImagePreview(item.imageUrl || '');
    setEditingItem(item);
    setShowForm(true);
  };

  // Toggle item availability
  const toggleAvailability = async (id, currentStatus) => {
    try {
      // Backend expects 'available' as query parameter, not body
      await apiService.put(`/api/admin/menu/${id}/availability?available=${!currentStatus}`);
      fetchMenuItems();
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      description: '',
      price: '',
      category: '',
      available: true,
      image: '',
      // Dietary information
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      spiceLevel: 0,
      // Inventory management
      stockQuantity: null,
      lowStockThreshold: 10,
      // Promotions
      isFeatured: false,
      discountPercentage: 0,
      // Preparation
      preparationTime: 30
    });
    setImageFile(null);
    setImagePreview('');
    setEditingItem(null);
    setShowForm(false);
    setFormErrors({});
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Menu Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          {showForm ? (
            <>
              <XIcon size={16} className="mr-2 text-white" />
              <span className="text-white">Cancel</span>
            </>
          ) : (
            <>
              <PlusIcon size={16} className="mr-2 text-white" />
              <span className="text-white">Add Menu Item</span>
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <form onSubmit={handleAddItem}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full p-2 border rounded-md ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full p-2 border rounded-md ${
                        formErrors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        formErrors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select category</option>
                      {menuCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Preparation Time (min)
                    </label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity || ''}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="Optional"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Spice Level (0-5)
                    </label>
                    <input
                      type="number"
                      name="spiceLevel"
                      value={formData.spiceLevel}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    Dietary Options
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isVegetarian"
                        name="isVegetarian"
                        checked={formData.isVegetarian}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="isVegetarian" className="text-sm text-gray-700">
                        🥬 Vegetarian
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isVegan"
                        name="isVegan"
                        checked={formData.isVegan}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="isVegan" className="text-sm text-gray-700">
                        🌱 Vegan
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isGlutenFree"
                        name="isGlutenFree"
                        checked={formData.isGlutenFree}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="isGlutenFree" className="text-sm text-gray-700">
                        🌾 Gluten-Free
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isSpicy"
                        name="isSpicy"
                        checked={formData.isSpicy}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="isSpicy" className="text-sm text-gray-700">
                        🌶️ Spicy
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    Status & Features
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="available"
                        name="available"
                        checked={formData.available}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="available" className="text-sm text-gray-700">
                        ✅ Available for ordering
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="isFeatured" className="text-sm text-gray-700">
                        ⭐ Featured item
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">
                    Image
                  </label>
                  <div className="flex items-center mb-2">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-300"
                    >
                      <ImageIcon size={16} className="mr-2" />
                      {imageFile ? 'Change Image' : 'Choose Image'}
                    </label>
                    {(imagePreview || imageFile) && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setFormData({ ...formData, image: '' });
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <XIcon size={16} />
                      </button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="mt-2 border rounded-md overflow-hidden w-full max-w-xs">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <SaveIcon size={16} className="mr-2" />
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          {menuCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
          </option>
          ))}
        </select>
      </div>

      {/* Menu Items List */}
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems
            .filter(item => !selectedCategory || item.category === selectedCategory)
            .map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <FoodImage
                    src={item.imageUrl}
                    alt={item.name}
                    category={item.category}
                    itemName={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {item.name}
                        {item.isFeatured && <span className="text-yellow-500">⭐</span>}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.isVegetarian && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            🥬 Veg
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            🌱 Vegan
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            🌾 GF
                          </span>
                        )}
                        {item.isSpicy && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            🌶️ Spicy {item.spiceLevel > 0 && `(${item.spiceLevel}/5)`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-green-600 block">
                        {formatPrice(item.price)}
                      </span>
                      {item.discountPercentage > 0 && (
                        <span className="text-xs text-orange-600 font-medium">
                          {item.discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  {item.preparationTime && (
                    <p className="text-xs text-gray-500 mb-2">
                      ⏱️ Prep: {item.preparationTime} min
                    </p>
                  )}
                  {item.stockQuantity !== null && item.stockQuantity !== undefined && (
                    <p className={`text-xs mb-2 ${
                      item.stockQuantity <= (item.lowStockThreshold || 10)
                        ? 'text-orange-600 font-medium'
                        : 'text-gray-500'
                    }`}>
                      📦 Stock: {item.stockQuantity}
                      {item.stockQuantity <= (item.lowStockThreshold || 10) && ' (Low)'}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleAvailability(item.id, item.isAvailable)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        title={item.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                      >
                        {item.isAvailable ? (
                          <EyeOffIcon size={18} className="text-gray-500" />
                        ) : (
                          <EyeIcon size={18} className="text-gray-500" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        title="Edit"
                      >
                        <EditIcon size={18} className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        title="Delete"
                      >
                        <TrashIcon size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      
      {!isLoading && menuItems.filter(item => !selectedCategory || item.category === selectedCategory).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No menu items found. {!showForm && 'Add your first menu item!'}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
