import React, { useState, useEffect } from 'react';
import AdminDeliveryDrivers from '../../components/admin/AdminDeliveryDrivers';
import { Truck, Clock, CheckCircle, XCircle } from 'lucide-react';
import adminService from '../../services/adminService';

const DeliveryManagement = () => {
  const [stats, setStats] = useState({
    pendingCount: 0,
    activeCount: 0,
    completedCount: 0,
    rejectedCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDriverStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all drivers with enabled field
      const allDrivers = await adminService.getAllDrivers();
      
      // Filter drivers by enabled status (pending vs active)
      const pendingDrivers = allDrivers.filter(driver => !driver.enabled);
      const activeDrivers = allDrivers.filter(driver => driver.enabled);
      const rejectedCount = 0; // No rejection workflow - drivers are deleted instead

      // For completed deliveries, sum up all deliveries from active drivers
      const completedCount = activeDrivers.reduce((sum, driver) => {
        return sum + (driver.totalDeliveries || 0);
      }, 0);

      setStats({
        pendingCount: pendingDrivers.length,
        activeCount: activeDrivers.length,
        completedCount: completedCount,
        rejectedCount: rejectedCount
      });
    } catch (error) {
      console.error('Failed to fetch driver statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDriverStats = () => {
    // Refresh stats when a driver is approved/rejected
    fetchDriverStats();
  };

  useEffect(() => {
    fetchDriverStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Delivery Driver Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">Pending Applications</p>
            <p className="text-2xl font-bold text-black">
              {loading ? '...' : stats.pendingCount}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Truck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">Active Drivers</p>
            <p className="text-2xl font-bold text-black">
              {loading ? '...' : stats.activeCount}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">Completed Deliveries</p>
            <p className="text-2xl font-bold text-black">
              {loading ? '...' : stats.completedCount}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">Rejected Applications</p>
            <p className="text-2xl font-bold text-black">
              {loading ? '...' : stats.rejectedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Driver Management Component with built-in tabs */}
      <AdminDeliveryDrivers onUpdate={updateDriverStats} />
    </div>
  );
};

export default DeliveryManagement;
