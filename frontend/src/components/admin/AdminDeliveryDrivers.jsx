import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Car, Phone, User, CheckCircle, XCircle, AlertTriangle, RefreshCw, Users, Package, TrendingUp } from 'lucide-react';
import adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDeliveryDrivers({ onUpdate }) {
  const { isAdmin } = useAuth();
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingDrivers();
    } else if (activeTab === 'active') {
      fetchActiveDrivers();
    } else if (activeTab === 'history') {
      fetchAllDrivers();
    }
  }, [isAdmin, activeTab]);

  const fetchPendingDrivers = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      const drivers = await adminService.getPendingDrivers();
      setPendingDrivers(drivers);
    } catch (error) {
      console.error('Failed to fetch pending drivers:', error);
      toast.error('Failed to load pending drivers');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveDrivers = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      const drivers = await adminService.getActiveDrivers();
      setActiveDrivers(drivers);
    } catch (error) {
      console.error('Failed to fetch active drivers:', error);
      toast.error('Failed to load active drivers');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDrivers = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      const response = await adminService.getAllDrivers();
      setAllDrivers(response);
    } catch (error) {
      console.error('Failed to fetch all drivers:', error);
      toast.error('Failed to load driver history');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (driverId) => {
    if (!isAdmin) return;
    
    try {
      setActionLoading(driverId);
      await adminService.approveDriver(driverId);
      toast.success('Driver approved successfully');
      // Remove from pending list
      setPendingDrivers(prev => prev.filter(driver => driver.id !== driverId));
      // Notify parent to update count
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to approve driver:', error);
      toast.error('Failed to approve driver');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (driverId) => {
    if (!isAdmin) return;
    
    try {
      setActionLoading(driverId);
      await adminService.rejectDriver(driverId);
      toast.success('Driver rejected');
      // Remove from pending list
      setPendingDrivers(prev => prev.filter(driver => driver.id !== driverId));
      // Notify parent to update count
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to reject driver:', error);
      toast.error('Failed to reject driver');
    } finally {
      setActionLoading(null);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Driver Management</h1>
        <p className="mt-2 text-gray-600">Manage delivery driver applications and active drivers</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Pending Applications
                {pendingDrivers.length > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs font-medium">
                    {pendingDrivers.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Active Drivers
                {activeDrivers.length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs font-medium">
                    {activeDrivers.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                All Drivers
                {allDrivers.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs font-medium">
                    {allDrivers.length}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Pending Drivers List */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pending Drivers</h2>
                <p className="text-sm text-gray-600">Drivers awaiting approval to join the delivery team</p>
              </div>
              <button
                onClick={fetchPendingDrivers}
                disabled={loading}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            {pendingDrivers.length > 0 ? (
              <div className="space-y-4">
                {pendingDrivers.map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{driver.name}</h3>
                        <p className="text-sm text-gray-600">ID: {driver.id}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-yellow-800 bg-yellow-100">
                          PENDING
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <strong>Phone:</strong> {driver.phone}
                      </div>
                      <div>
                        <strong>Vehicle:</strong> {driver.vehicleNumber} ({driver.vehicleType})
                      </div>
                      <div>
                        <strong>License:</strong> {driver.licenseNumber}
                      </div>
                      <div>
                        <strong>Email:</strong> {driver.email}
                      </div>
                      <div>
                        <strong>Address:</strong> {driver.address}
                      </div>
                      <div>
                        <strong>Emergency:</strong> {driver.emergencyContact} ({driver.emergencyPhone})
                      </div>
                    </div>

                    {driver.notes && (
                      <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>Notes:</strong> {driver.notes}
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleReject(driver.id)}
                        disabled={actionLoading === driver.id}
                        className="flex items-center px-4 py-2 text-red-700 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {actionLoading === driver.id ? 'Rejecting...' : 'Reject'}
                      </button>
                      <button
                        onClick={() => handleApprove(driver.id)}
                        disabled={actionLoading === driver.id}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {actionLoading === driver.id ? 'Approving...' : 'Approve'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No pending driver approvals</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Drivers List */}
      {activeTab === 'active' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Active Drivers</h2>
                <p className="text-sm text-gray-600">Currently active delivery drivers</p>
              </div>
              <button
                onClick={fetchActiveDrivers}
                disabled={loading}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeDrivers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeDrivers.map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{driver.name}</h3>
                        <p className="text-xs text-gray-500">ID: {driver.id}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full text-green-800 bg-green-100">
                        ACTIVE
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {driver.phone}
                      </div>
                      <div className="flex items-center">
                        <Car className="w-4 h-4 mr-2 text-gray-400" />
                        {driver.vehicleNumber} - {driver.vehicleType}
                      </div>
                      <div className="text-xs">
                        <strong>License:</strong> {driver.licenseNumber}
                      </div>
                    </div>

                    {driver.currentDeliveries !== undefined && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Current Deliveries</span>
                          <span className="font-semibold text-gray-900">{driver.currentDeliveries || 0}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No active drivers</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Drivers / Delivery History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">All Drivers</h2>
                <p className="text-sm text-gray-600">Complete driver list with delivery statistics</p>
              </div>
              <button
                onClick={fetchAllDrivers}
                disabled={loading}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            {allDrivers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statistics
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                              <div className="text-sm text-gray-500">ID: {driver.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.phone}</div>
                          <div className="text-sm text-gray-500">{driver.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <Car className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-gray-900">{driver.vehicleNumber}</div>
                              <div className="text-gray-500">{driver.vehicleType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            driver.status === 'APPROVED' && driver.isActive
                              ? 'bg-green-100 text-green-800'
                              : driver.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {driver.status === 'APPROVED' && driver.isActive ? 'ACTIVE' : driver.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-1 text-blue-500" />
                              <span className="text-gray-900 font-medium">{driver.totalDeliveries || 0}</span>
                              <span className="text-gray-500 ml-1">deliveries</span>
                            </div>
                            {driver.rating && (
                              <div className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1 text-yellow-500" />
                                <span className="text-gray-900 font-medium">{driver.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No driver data available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}