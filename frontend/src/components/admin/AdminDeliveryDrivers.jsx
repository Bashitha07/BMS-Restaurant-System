import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Car, Phone, User, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminDeliveryDrivers({ onUpdate }) {
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const fetchPendingDrivers = async () => {
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

  const handleApprove = async (driverId) => {
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pending Driver Approvals</h1>
        <p className="mt-2 text-gray-600">Review and approve delivery driver registration requests</p>
      </div>

      {/* Pending Drivers List */}
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
    </div>
  );
}