import React, { useEffect, useState } from 'react';
import { PlusIcon, Trash2Icon, EditIcon, SearchIcon, XIcon, ImageIcon, ArrowUpDownIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MenuItem } from '../../contexts/CartContext';
export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [sortField, setSortField] = useState<'name' | 'price' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    available: true
  });
  // Mock data for menu items
  useEffect(() => {
    // This would normally be fetched from an API
    const mockMenuItems: MenuItem[] = [{
      id: '1',
      name: 'Chicken Kottu',
      description: 'Delicious Sri Lankan street food made with chopped flatbread, vegetables, and chicken.',
      price: 3900,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      category: 'kottu',
      available: true
    }, {
      id: '2',
      name: 'Vegetable Fried Rice',
      description: 'Flavorful rice stir-fried with mixed vegetables and spices.',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      category: 'rice',
      available: true
    }, {
      id: '3',
      name: 'Beef Burger',
      description: 'Juicy beef patty with fresh vegetables and special sauce.',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      category: 'burgers',
      available: true
    }, {
      id: '4',
      name: 'Chicken Submarine',
      description: 'Grilled chicken with fresh vegetables and mayo in a submarine bun.',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      category: 'submarines',
      available: true
    }, {
      id: '5',
      name: 'French Fries',
      description: 'Crispy golden fries seasoned with special spices.',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      category: 'bites',
      available: true
    }];
    setMenuItems(mockMenuItems);
    setFilteredItems(mockMenuItems);
  }, []);
  useEffect(() => {
    // Filter items based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = menuItems.filter(item => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
      setFilteredItems(filtered);
    } else {
      setFilteredItems([...menuItems]);
    }
    // Apply sorting
    const sorted = [...filteredItems].sort((a, b) => {
      if (sortField === 'price') {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortField === 'name' || sortField === 'category') {
        const valueA = a[sortField].toLowerCase();
        const valueB = b[sortField].toLowerCase();
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });
    setFilteredItems(sorted);
  }, [searchQuery, menuItems, sortField, sortDirection]);
  const handleSort = (field: 'name' | 'price' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const openAddModal = () => {
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      available: true
    });
    setIsAddModalOpen(true);
  };
  const openEditModal = (item: MenuItem) => {
    setCurrentItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      available: item.available
    });
    setIsEditModalOpen(true);
  };
  const openDeleteModal = (item: MenuItem) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewItem(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'price') {
      setNewItem(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setNewItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleAddItem = () => {
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      category: newItem.category,
      image: newItem.image || 'https://via.placeholder.com/300',
      available: newItem.available
    };
    setMenuItems([...menuItems, newMenuItem]);
    setIsAddModalOpen(false);
  };
  const handleUpdateItem = () => {
    if (!currentItem) return;
    const updatedItems = menuItems.map(item => {
      if (item.id === currentItem.id) {
        return {
          ...item,
          name: newItem.name,
          description: newItem.description,
          price: newItem.price,
          category: newItem.category,
          image: newItem.image,
          available: newItem.available
        };
      }
      return item;
    });
    setMenuItems(updatedItems);
    setIsEditModalOpen(false);
  };
  const handleDeleteItem = () => {
    if (!currentItem) return;
    const updatedItems = menuItems.filter(item => item.id !== currentItem.id);
    setMenuItems(updatedItems);
    setIsDeleteModalOpen(false);
  };
  const toggleAvailability = (id: string) => {
    const updatedItems = menuItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          available: !item.available
        };
      }
      return item;
    });
    setMenuItems(updatedItems);
  };
  return <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <PlusIcon size={16} />
            <span>Add New Item</span>
          </Button>
        </div>
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search menu items..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchQuery} onChange={handleSearch} />
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => {
              const filtered = e.target.value === 'all' ? menuItems : menuItems.filter(item => item.category === e.target.value);
              setFilteredItems(filtered);
            }}>
                <option value="all">All Categories</option>
                <option value="kottu">Kottu</option>
                <option value="rice">Rice</option>
                <option value="burgers">Burgers</option>
                <option value="submarines">Submarines</option>
                <option value="bites">Bites</option>
                <option value="desserts">Desserts</option>
                <option value="juice">Juice</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => {
              const value = e.target.value;
              if (value === 'available') {
                setFilteredItems(menuItems.filter(item => item.available));
              } else if (value === 'unavailable') {
                setFilteredItems(menuItems.filter(item => !item.available));
              } else {
                setFilteredItems(menuItems);
              }
            }}>
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
        {/* Menu Items Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      <span>Name</span>
                      <ArrowUpDownIcon size={14} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                    <div className="flex items-center">
                      <span>Price</span>
                      <ArrowUpDownIcon size={14} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('category')}>
                    <div className="flex items-center">
                      <span>Category</span>
                      <ArrowUpDownIcon size={14} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 ? <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No menu items found
                    </td>
                  </tr> : filteredItems.map(item => <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                          {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon size={24} className="text-gray-400" />
                            </div>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Rs. {item.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {item.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => toggleAvailability(item.id)} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900">
                            <EditIcon size={18} />
                          </button>
                          <button onClick={() => openDeleteModal(item)} className="text-red-600 hover:text-red-900">
                            <Trash2Icon size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        {/* Add Menu Item Modal */}
        {isAddModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add New Menu Item</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <XIcon size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <Input label="Item Name" name="name" value={newItem.name} onChange={handleInputChange} required />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea name="description" value={newItem.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Price (Rs.)" name="price" type="number" value={newItem.price.toString()} onChange={handleInputChange} required />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select name="category" value={newItem.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
                      <option value="">Select Category</option>
                      <option value="kottu">Kottu</option>
                      <option value="rice">Rice</option>
                      <option value="burgers">Burgers</option>
                      <option value="submarines">Submarines</option>
                      <option value="bites">Bites</option>
                      <option value="desserts">Desserts</option>
                      <option value="juice">Juice</option>
                      <option value="noodles">Noodles</option>
                    </select>
                  </div>
                </div>
                <Input label="Image URL" name="image" value={newItem.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                <div className="flex items-center mb-4">
                  <input type="checkbox" id="available" name="available" checked={newItem.available} onChange={e => setNewItem(prev => ({
                ...prev,
                available: e.target.checked
              }))} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                  <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                    Available for order
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem} disabled={!newItem.name || !newItem.description || !newItem.price || !newItem.category}>
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
          </div>}
        {/* Edit Menu Item Modal */}
        {isEditModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Edit Menu Item</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <XIcon size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <Input label="Item Name" name="name" value={newItem.name} onChange={handleInputChange} required />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea name="description" value={newItem.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Price (Rs.)" name="price" type="number" value={newItem.price.toString()} onChange={handleInputChange} required />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select name="category" value={newItem.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
                      <option value="">Select Category</option>
                      <option value="kottu">Kottu</option>
                      <option value="rice">Rice</option>
                      <option value="burgers">Burgers</option>
                      <option value="submarines">Submarines</option>
                      <option value="bites">Bites</option>
                      <option value="desserts">Desserts</option>
                      <option value="juice">Juice</option>
                      <option value="noodles">Noodles</option>
                    </select>
                  </div>
                </div>
                <Input label="Image URL" name="image" value={newItem.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                <div className="flex items-center mb-4">
                  <input type="checkbox" id="available" name="available" checked={newItem.available} onChange={e => setNewItem(prev => ({
                ...prev,
                available: e.target.checked
              }))} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                  <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                    Available for order
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateItem} disabled={!newItem.name || !newItem.description || !newItem.price || !newItem.category}>
                    Update Item
                  </Button>
                </div>
              </div>
            </div>
          </div>}
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2Icon size={24} className="text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Menu Item
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete "{currentItem?.name}"? This
                  action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDeleteItem}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}

export default MenuManagement;
