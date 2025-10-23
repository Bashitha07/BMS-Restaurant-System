import React, { useState, useEffect } from 'react';
import AdminDeliveryDrivers from '../../components/admin/AdminDeliveryDrivers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Truck, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const DeliveryManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState({
    pendingCount: 0,
    activeCount: 0,
    completedCount: 0,
    rejectedCount: 0
  });

  const updateDriverStats = () => {
    // In a real implementation, this would fetch actual counts from your API
    // For now, we'll just decrement the pending count when approving/rejecting
    setStats(prev => ({
      ...prev,
      pendingCount: Math.max(0, prev.pendingCount - 1)
    }));
  };

  // In a real implementation, this would fetch counts from your API
  useEffect(() => {
    // Mock stats - in a real app, you'd fetch these from your API
    setStats({
      pendingCount: 3,
      activeCount: 8,
      completedCount: 24,
      rejectedCount: 5
    });
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
            <p className="text-2xl font-bold text-black">{stats.pendingCount}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Truck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">Active Drivers</p>
            <p className="text-2xl font-bold text-black">{stats.activeCount}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">Completed Deliveries</p>
            <p className="text-2xl font-bold text-black">{stats.completedCount}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">Rejected Applications</p>
            <p className="text-2xl font-bold text-black">{stats.rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* Tabs for different driver management sections */}
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-6 py-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="text-center py-2">
                Pending Applications
              </TabsTrigger>
              <TabsTrigger value="active" className="text-center py-2">
                Active Drivers
              </TabsTrigger>
              <TabsTrigger value="history" className="text-center py-2">
                Delivery History
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pending" className="p-0">
            <AdminDeliveryDrivers onUpdate={updateDriverStats} />
          </TabsContent>
          
          <TabsContent value="active" className="p-6">
            <div className="text-center py-8">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900">Active Drivers</h3>
              <p className="text-gray-500">Active drivers management will be implemented soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="p-6">
            <div className="text-center py-8">
              <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900">Delivery History</h3>
              <p className="text-gray-500">Delivery history tracking will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveryManagement;
