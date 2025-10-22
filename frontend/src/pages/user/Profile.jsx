import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Button } from '../../components/ui/Button';
import adminService from '../../services/adminService';
import AdminMenuManagement from '../../components/admin/AdminMenuManagement';
import AdminDeliveryDrivers from '../../components/admin/AdminDeliveryDrivers';
import { Users, UserCheck, Shield, Eye, Edit, Save, X, ChefHat, Settings, Truck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const initialTab = urlParams.get('tab') || 'profile';
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Admin user management state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [showAdminSection, setShowAdminSection] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab); // 'profile', 'users', 'menu'

  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role === 'ADMIN';
  
  // Function to handle tab changes and update URL
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Update URL without page reload
    const newUrl = tabName === 'profile' ? '/profile' : `/profile?tab=${tabName}`;
    navigate(newUrl, { replace: true });
  };
  
  // Helper function to check if a user has a specific role (case-insensitive)
  const hasRole = (userRole, targetRole) => {
    return userRole?.toLowerCase() === targetRole.toLowerCase();
  };
  
  // Available roles
  const availableRoles = ['user', 'admin', 'delivery_driver', 'manager'];
  const roleLabels = {
    user: 'Customer',
    admin: 'Administrator', 
    delivery_driver: 'Delivery Driver',
    manager: 'Manager'
  };

  // Fetch all users for admin
  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    setUsersLoading(true);
    try {
      const allUsers = await adminService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('❌ [DB] Failed to fetch users from database:', error);
      notifyError('Failed to load users from database');
      setUsers([]); // Show empty list if database fetch fails
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && (showAdminSection || activeTab === 'users')) {

      fetchUsers();
    }
  }, [isAdmin, showAdminSection, activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔄 [DB] Initiating profile update operation:', {
      operation: 'UPDATE_USER_PROFILE',
      userId: user?.id,
      username: user?.username,
      changes: {
        oldData: {
          username: user?.username,
          email: user?.email,
          phone: user?.phone
        },
        newData: formData
      },
      timestamp: new Date().toISOString()
    });
    
    setLoading(true);
    try {
      await updateProfile(formData);
      
      console.log('✅ [DB] Profile update successful - Database updated:', {
        operation: 'UPDATE_USER_PROFILE_SUCCESS',
        userId: user?.id,
        username: formData.username,
        updatedFields: formData,
        timestamp: new Date().toISOString()
      });
      
      setIsEditing(false);
      notifySuccess('Profile updated successfully!');
    } catch (error) {
      console.error('❌ [DB] Profile update failed - Database error:', {
        operation: 'UPDATE_USER_PROFILE_ERROR',
        userId: user?.id,
        username: user?.username,
        attemptedData: formData,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      notifyError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  // Admin user management functions
  const handleRoleChange = async (userId, role) => {
    if (!isAdmin) return;
    
    const user = users.find(u => u.id === userId);
    const oldRole = user?.role;
    
    console.log('🔄 [DB] Initiating role change operation:', {
      operation: 'UPDATE_USER_ROLE',
      userId: userId,
      username: user?.username,
      oldRole: oldRole,
      newRole: role,
      timestamp: new Date().toISOString()
    });
    
    try {
      await adminService.updateUserRole(userId, { role });
      
      console.log('✅ [DB] Role change successful - Database updated:', {
        operation: 'UPDATE_USER_ROLE_SUCCESS',
        userId: userId,
        username: user?.username,
        roleChange: `${oldRole} → ${role}`,
        newRoleLabel: roleLabels[role],
        timestamp: new Date().toISOString()
      });
      
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      setEditingUserId(null);
      setNewRole('');
      notifySuccess(`User role updated to ${roleLabels[role]}`);
    } catch (error) {
      console.error('❌ [DB] Role change failed - Database error:', {
        operation: 'UPDATE_USER_ROLE_ERROR',
        userId: userId,
        username: user?.username,
        attemptedRole: role,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      notifyError('Failed to update user role in database');
    }
  };

  const handleStatusToggle = async (userId, enabled) => {
    if (!isAdmin) return;
    
    const user = users.find(u => u.id === userId);
    const oldStatus = user?.enabled;
    
    console.log('🔄 [DB] Initiating user status change operation:', {
      operation: 'UPDATE_USER_STATUS',
      userId: userId,
      username: user?.username,
      oldStatus: oldStatus ? 'ENABLED' : 'DISABLED',
      newStatus: enabled ? 'ENABLED' : 'DISABLED',
      timestamp: new Date().toISOString()
    });
    
    try {
      await adminService.updateUserStatus(userId, enabled);
      
      console.log('✅ [DB] Status change successful - Database updated:', {
        operation: 'UPDATE_USER_STATUS_SUCCESS',
        userId: userId,
        username: user?.username,
        statusChange: `${oldStatus ? 'ENABLED' : 'DISABLED'} → ${enabled ? 'ENABLED' : 'DISABLED'}`,
        timestamp: new Date().toISOString()
      });
      
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled } : u));
      notifySuccess(`User ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('❌ [DB] Status change failed - Database error:', {
        operation: 'UPDATE_USER_STATUS_ERROR',
        userId: userId,
        username: user?.username,
        attemptedStatus: enabled ? 'ENABLED' : 'DISABLED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      notifyError('Failed to update user status in database');
    }
  };

  const startRoleEdit = (userId, currentRole) => {
    setEditingUserId(userId);
    setNewRole(currentRole);
  };

  const cancelRoleEdit = () => {
    setEditingUserId(null);
    setNewRole('');
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  if (!user) {
    return <div className="text-center py-8">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* System Overview Header for Admin */}
        {isAdmin && (
          <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Restaurant Management System</h1>
                <p className="text-blue-100">Multi-user platform supporting concurrent operations for customers, drivers, and administrators</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-blue-200">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{users.filter(u => u.enabled).length}</div>
                  <div className="text-blue-200">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{users.filter(u => new Date(u.lastLogin) > new Date(Date.now() - 24*60*60*1000)).length}</div>
                  <div className="text-blue-200">Online Today</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Tab Navigation */}
        {isAdmin && (
          <div className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Profile Management
                </button>
                <button
                  onClick={() => handleTabChange('users')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  User Management
                </button>
                <button
                  onClick={() => handleTabChange('menu')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'menu'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ChefHat className="w-4 h-4 inline mr-2" />
                  Menu Management
                </button>
                <button
                  onClick={() => handleTabChange('drivers')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'drivers'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Truck className="w-4 h-4 inline mr-2" />
                  Driver Applications
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'profile' && isAdmin && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Admin Statistics Panel */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h1 className="text-2xl font-bold text-gray-900">System Statistics</h1>
                </div>

                <div className="px-6 py-6">
                  {/* System statistics content would go here */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-800">Total Orders</div>
                      <div className="text-2xl font-bold text-blue-900">156</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800">Active Users</div>
                      <div className="text-2xl font-bold text-green-900">42</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <div className="text-sm font-medium text-purple-800">Menu Items</div>
                      <div className="text-2xl font-bold text-purple-900">38</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="text-sm font-medium text-yellow-800">Daily Revenue</div>
                      <div className="text-2xl font-bold text-yellow-900">₹12,500</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-red-600" />
                    <h2 className="text-xl font-bold text-gray-900">Live User Management</h2>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Multi-User Support Active
                    </span>
                  </div>
                  <Button
                    onClick={() => setShowAdminSection(!showAdminSection)}
                    variant="outline"
                    className="text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {showAdminSection ? 'Hide' : 'Show'} Users
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  System supporting concurrent access for {users.length} registered users across multiple roles
                </p>
              </div>

              {showAdminSection && (
                <div className="px-6 py-6">
                  {/* Search and Filter */}
                  <div className="mb-6 space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Search users by username or email..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <select
                        value={selectedRoleFilter}
                        onChange={(e) => setSelectedRoleFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="All">All Roles</option>
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{roleLabels[role]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Users List */}
                  {usersLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredUsers.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No users found</p>
                      ) : (
                        filteredUsers.map((u) => (
                          <div key={u.id} className="bg-gray-50 rounded-lg p-4 border hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium text-gray-900">{u.username}</h3>
                                  {/* Activity status indicator */}
                                  {new Date(u.lastLogin) > new Date(Date.now() - 24*60*60*1000) && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                                      Active Today
                                    </span>
                                  )}
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    !u.enabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {u.enabled ? 'Online' : 'Offline'}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    u.role === 'admin' ? 'bg-red-100 text-red-800' :
                                    u.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                                    u.role === 'delivery_driver' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {roleLabels[u.role]}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                  <div>
                                    <span className="font-medium">Email:</span> {u.email}
                                  </div>
                                  {u.phone && (
                                    <div>
                                      <span className="font-medium">Phone:</span> {u.phone}
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-medium">Joined:</span> {new Date(u.createdAt).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <span className="font-medium">Last Login:</span> {new Date(u.lastLogin).toLocaleDateString()}
                                  </div>
                                </div>

                                {/* Role-specific information */}
                                {u.role === 'user' && (
                                  <div className="bg-blue-50 p-2 rounded text-xs space-y-1">
                                    <div><span className="font-medium">Orders:</span> {u.orderCount || 0}</div>
                                    <div><span className="font-medium">Total Spent:</span> LKR {u.totalSpent?.toLocaleString() || '0'}</div>
                                  </div>
                                )}
                                
                                {u.role === 'delivery_driver' && (
                                  <div className="bg-purple-50 p-2 rounded text-xs space-y-1">
                                    <div><span className="font-medium">Deliveries:</span> {u.deliveryCount || 0}</div>
                                    <div><span className="font-medium">Rating:</span> ⭐ {u.rating || 'N/A'}</div>
                                    <div><span className="font-medium">Vehicle:</span> {u.vehicleType || 'Not specified'}</div>
                                  </div>
                                )}
                                
                                {(u.role === 'admin' || u.role === 'manager') && (
                                  <div className="bg-yellow-50 p-2 rounded text-xs space-y-1">
                                    <div><span className="font-medium">Department:</span> {u.department || 'General'}</div>
                                    <div><span className="font-medium">Level:</span> {u.role === 'admin' ? 'Administrator' : 'Manager'}</div>
                                  </div>
                                )}

                                {/* Role editing */}
                                <div className="mt-3 flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Role:</span>
                                  {editingUserId === u.id ? (
                                    <div className="flex items-center gap-2">
                                      <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="px-2 py-1 text-xs border border-gray-300 rounded"
                                      >
                                        {availableRoles.map(role => (
                                          <option key={role} value={role}>{roleLabels[role]}</option>
                                        ))}
                                      </select>
                                      <button
                                        onClick={() => handleRoleChange(u.id, newRole)}
                                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                                      >
                                        <Save className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={cancelRoleEdit}
                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      {u.id !== user.id && (
                                        <button
                                          onClick={() => startRoleEdit(u.id, u.role)}
                                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {u.id !== user.id && (
                                <div className="ml-4 flex flex-col gap-2">
                                  <button
                                    onClick={() => handleStatusToggle(u.id, !u.enabled)}
                                    className={`px-3 py-1 rounded text-sm font-medium ${
                                      u.enabled 
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                  >
                                    {u.enabled ? 'Disable' : 'Enable'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Real-time User Statistics */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Multi-User System Statistics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-blue-800">Total Users</div>
                        <div className="text-2xl font-bold text-blue-900">{users.length}</div>
                        <div className="text-xs text-blue-600">Concurrent Support</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-sm font-medium text-green-800">Online Users</div>
                        <div className="text-2xl font-bold text-green-900">
                          {users.filter(u => u.enabled).length}
                        </div>
                        <div className="text-xs text-green-600">Real-time Active</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <div className="text-sm font-medium text-purple-800">Customers</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {users.filter(u => u.role === 'user').length}
                        </div>
                        <div className="text-xs text-purple-600">Active Orders</div>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                        <div className="text-sm font-medium text-indigo-800">Drivers</div>
                        <div className="text-2xl font-bold text-indigo-900">
                          {users.filter(u => u.role === 'delivery_driver').length}
                        </div>
                        <div className="text-xs text-indigo-600">Live Tracking</div>
                      </div>
                    </div>
                  </div>

                  {/* Concurrent User Activity */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Live System Activity
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Active Today:</span> {users.filter(u => new Date(u.lastLogin) > new Date(Date.now() - 24*60*60*1000)).length} users
                      </div>
                      <div>
                        <span className="font-medium">Concurrent Capacity:</span> Unlimited users supported
                      </div>
                      <div>
                        <span className="font-medium">Peak Customer:</span> {users.filter(u => u.role === 'user').sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))[0]?.username || 'None'} (LKR {users.filter(u => u.role === 'user').sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))[0]?.totalSpent?.toLocaleString() || '0'})
                      </div>
                      <div>
                        <span className="font-medium">Top Driver:</span> {users.filter(u => u.role === 'delivery_driver').sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]?.username || 'None'} (⭐ {users.filter(u => u.role === 'delivery_driver').sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]?.rating || 'N/A'})
                      </div>
                      <div>
                        <span className="font-medium">System Status:</span> <span className="text-green-600 font-medium">Multi-user operational</span>
                      </div>
                      <div>
                        <span className="font-medium">Load Balancing:</span> <span className="text-blue-600 font-medium">Auto-scaling enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* User Management Tab */}
        {activeTab === 'users' && isAdmin && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-purple-50">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">User Management Dashboard</h2>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  {users.filter(u => u.enabled).length} Active Users
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Comprehensive user management for the restaurant system
              </p>
            </div>

            <div className="px-6 py-6">
              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search users by username or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <select
                    value={selectedRoleFilter}
                    onChange={(e) => setSelectedRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Roles</option>
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{roleLabels[role]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Users List */}
              {usersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No users found</p>
                  ) : (
                    filteredUsers.map((u) => (
                      <div key={u.id} className="bg-gray-50 rounded-lg p-4 border hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900">{u.username}</h3>
                              {new Date(u.lastLogin) > new Date(Date.now() - 24*60*60*1000) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                                  Active Today
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                !u.enabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {u.enabled ? 'Online' : 'Offline'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                u.role === 'admin' ? 'bg-red-100 text-red-800' :
                                u.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                                u.role === 'delivery_driver' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {roleLabels[u.role]}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                              <div><span className="font-medium">Email:</span> {u.email}</div>
                              {u.phone && <div><span className="font-medium">Phone:</span> {u.phone}</div>}
                              <div><span className="font-medium">Joined:</span> {new Date(u.createdAt).toLocaleDateString()}</div>
                              <div><span className="font-medium">Last Login:</span> {new Date(u.lastLogin).toLocaleDateString()}</div>
                            </div>

                            {/* Role-specific information */}
                            {u.role === 'user' && (
                              <div className="bg-blue-50 p-2 rounded text-xs space-y-1">
                                <div><span className="font-medium">Orders:</span> {u.orderCount || 0}</div>
                                <div><span className="font-medium">Total Spent:</span> LKR {u.totalSpent?.toLocaleString() || '0'}</div>
                              </div>
                            )}
                            
                            {u.role === 'delivery_driver' && (
                              <div className="bg-purple-50 p-2 rounded text-xs space-y-1">
                                <div><span className="font-medium">Deliveries:</span> {u.deliveryCount || 0}</div>
                                <div><span className="font-medium">Rating:</span> ⭐ {u.rating || 'N/A'}</div>
                                <div><span className="font-medium">Vehicle:</span> {u.vehicleType || 'Not specified'}</div>
                              </div>
                            )}
                            
                            {(u.role === 'admin' || u.role === 'manager') && (
                              <div className="bg-yellow-50 p-2 rounded text-xs space-y-1">
                                <div><span className="font-medium">Department:</span> {u.department || 'General'}</div>
                                <div><span className="font-medium">Level:</span> {u.role === 'admin' ? 'Administrator' : 'Manager'}</div>
                              </div>
                            )}

                            {/* Role editing */}
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-gray-500">Role:</span>
                              {editingUserId === u.id ? (
                                <div className="flex items-center gap-2">
                                  <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    className="px-2 py-1 text-xs border border-gray-300 rounded"
                                  >
                                    {availableRoles.map(role => (
                                      <option key={role} value={role}>{roleLabels[role]}</option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => handleRoleChange(u.id, newRole)}
                                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                                  >
                                    <Save className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={cancelRoleEdit}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  {u.id !== user.id && (
                                    <button
                                      onClick={() => startRoleEdit(u.id, u.role)}
                                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {u.id !== user.id && (
                            <div className="ml-4 flex flex-col gap-2">
                              <button
                                onClick={() => handleStatusToggle(u.id, !u.enabled)}
                                className={`px-3 py-1 rounded text-sm font-medium ${
                                  u.enabled 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {u.enabled ? 'Disable' : 'Enable'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && isAdmin && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Menu Management Dashboard</h2>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                  Advanced Controls
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Complete menu management with image upload and item creation capabilities
              </p>
            </div>

            <div className="p-6">
              <AdminMenuManagement />
            </div>
          </div>
        )}

        {/* Driver Applications Tab */}
        {activeTab === 'drivers' && isAdmin && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Driver Applications Dashboard</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  Approval Management
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Review and approve delivery driver applications
              </p>
            </div>

            <div className="p-6">
              <AdminDeliveryDrivers />
            </div>
          </div>
        )}

        {/* Non-admin users see simplified profile only */}
        {(!isAdmin || (isAdmin && activeTab === 'profile')) && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              </div>

              <div className="px-6 py-6">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'delivery_driver' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {roleLabels[user.role] || user.role}
                        </span>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(true)} className="mt-4">
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
