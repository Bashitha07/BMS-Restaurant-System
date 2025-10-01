import React, { useEffect, useState } from 'react';
import { SearchIcon, TruckIcon, MapPinIcon, PhoneIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for deliveries
  useEffect(() => {
    const mockDeliveries = [
      {
        id: 'DEL-001',
        orderId: 'ORD-1234',
        customerName: 'John Smith',
        customerPhone: '+94 77 123 4567',
        address: '123 Main St, Colombo 5',
        driverName: 'Ravi Kumar',
        driverPhone: '+94 77 987 6543',
        status: 'in_transit',
        estimatedDelivery: '2023-05-20 19:30',
        items: ['Chicken Kottu', 'French Fries'],
        total: 9300
      },
      {
        id: 'DEL-002',
        orderId: 'ORD-1235',
        customerName: 'Sarah Johnson',
        customerPhone: '+94 77 234 5678',
        address: '456 Park Ave, Colombo 7',
        driverName: 'Nimal Fernando',
        driverPhone: '+94 77 876 5432',
        status: 'pending',
        estimatedDelivery: '2023-05-21 20:00',
        items: ['Beef Burger', 'Watermelon Juice'],
        total: 4900
      },
      {
        id: 'DEL-003',
        orderId: 'ORD-1236',
        customerName: 'Michael Chen',
        customerPhone: '+94 77 345 6789',
        address: '789 Oak St, Nugegoda',
        driverName: 'Saman Perera',
        driverPhone: '+94 77 765 4321',
        status: 'delivered',
        estimatedDelivery: '2023-05-19 18:45',
        items: ['Vegetable Fried Rice', 'Chicken Submarine'],
        total: 6000
      }
    ];
    setDeliveries(mockDeliveries);
    setFilteredDeliveries(mockDeliveries);
  }, []);

  useEffect(() => {
    let filtered = deliveries;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(delivery =>
        delivery.id.toLowerCase().includes(query) ||
        delivery.orderId.toLowerCase().includes(query) ||
        delivery.customerName.toLowerCase().includes(query) ||
        delivery.driverName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    setFilteredDeliveries(filtered);
  }, [searchQuery, statusFilter, deliveries]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateDeliveryStatus = (id, newStatus) => {
    const updatedDeliveries = deliveries.map(delivery =>
      delivery.id === id ? { ...delivery, status: newStatus } : delivery
    );
    setDeliveries(updatedDeliveries);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Delivery Management</h1>
          <Button className="flex items-center gap-2">
            <TruckIcon size={16} />
            <span>Assign Driver</span>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search deliveries by ID, order ID, customer or driver..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No deliveries found
                    </td>
                  </tr>
                ) : (
                  filteredDeliveries.map(delivery => (
                    <tr key={delivery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {delivery.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          Order: {delivery.orderId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rs. {delivery.total.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {delivery.customerName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <PhoneIcon size={14} />
                          {delivery.customerPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {delivery.driverName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <PhoneIcon size={14} />
                          {delivery.driverPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1">
                          <MapPinIcon size={14} className="text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-900 max-w-xs">
                            {delivery.address}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {delivery.status.replace('_', ' ').charAt(0).toUpperCase() + delivery.status.replace('_', ' ').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <ClockIcon size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {delivery.estimatedDelivery}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {delivery.status === 'pending' && (
                            <button
                              onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark as In Transit"
                            >
                              <TruckIcon size={18} />
                            </button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <button
                              onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Delivered"
                            >
                              <CheckIcon size={18} />
                            </button>
                          )}
                          {(delivery.status === 'pending' || delivery.status === 'in_transit') && (
                            <button
                              onClick={() => updateDeliveryStatus(delivery.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel Delivery"
                            >
                              <XIcon size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryManagement;
