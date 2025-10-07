import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Phone, Mail, MapPin, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ReservationManagement = () => {
  const { user, isAdmin } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock comprehensive reservation data (admin view with full details)
  const mockReservations = [
    {
      id: 'RES-001',
      customerName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      date: '2025-10-05',
      time: '19:00',
      guests: 4,
      specialRequests: 'Anniversary dinner, window table preferred',
      status: 'confirmed',
      tableNumber: 12,
      createdAt: '2025-10-03T10:30:00Z',
      customerAddress: '123 Main St, Cityville, ST 12345',
      totalAmount: 0, // Will be calculated after dining
      notes: 'VIP customer, allergic to shellfish'
    },
    {
      id: 'RES-002',
      customerName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 987-6543',
      date: '2025-10-06',
      time: '20:30',
      guests: 2,
      specialRequests: 'Vegetarian menu',
      status: 'pending',
      tableNumber: null,
      createdAt: '2025-10-03T14:15:00Z',
      customerAddress: '456 Oak Ave, Townburg, ST 67890',
      totalAmount: 0,
      notes: 'First time customer'
    },
    {
      id: 'RES-003',
      customerName: 'Michael Brown',
      email: 'mbrown@email.com',
      phone: '+1 (555) 555-0123',
      date: '2025-10-04',
      time: '18:00',
      guests: 6,
      specialRequests: 'Birthday celebration, need high chair',
      status: 'completed',
      tableNumber: 8,
      createdAt: '2025-10-02T09:45:00Z',
      customerAddress: '789 Pine Rd, Villageton, ST 54321',
      totalAmount: 285.50,
      notes: 'Regular customer, prefers table 8'
    }
  ];

  useEffect(() => {
    if (!isAdmin) {
      // Redirect non-admin users
      return;
    }
    setReservations(mockReservations);
  }, [isAdmin]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const updateReservationStatus = (reservationId, newStatus) => {
    setReservations(prev =>
      prev.map(res =>
        res.id === reservationId ? { ...res, status: newStatus } : res
      )
    );
  };

  const filteredReservations = reservations.filter(res =>
    filterStatus === 'all' || res.status === filterStatus
  );

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>Only administrators can view detailed reservation information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservation Management</h1>
        <p className="text-gray-600">Comprehensive view of all restaurant reservations</p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                      <div className="text-sm text-gray-500">
                        Table {reservation.tableNumber || 'Unassigned'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                      <div className="text-sm text-gray-500">{reservation.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{reservation.date}</div>
                        <div className="text-sm text-gray-500">{reservation.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{reservation.guests}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(reservation.status)}
                      <span className="ml-2">{getStatusBadge(reservation.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedReservation(reservation)}
                      className="text-orange-600 hover:text-orange-900 mr-4"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {reservation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 mr-2"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Reservation Details</h2>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{selectedReservation.customerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{selectedReservation.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{selectedReservation.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                    <span>{selectedReservation.customerAddress}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Reservation Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{selectedReservation.date} at {selectedReservation.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{selectedReservation.guests} guests</span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(selectedReservation.status)}
                    <span className="ml-3">{getStatusBadge(selectedReservation.status)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Table: </span>
                    {selectedReservation.tableNumber || 'Not assigned'}
                  </div>
                  {selectedReservation.totalAmount > 0 && (
                    <div>
                      <span className="font-medium">Total Amount: </span>
                      ${selectedReservation.totalAmount}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {selectedReservation.specialRequests && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">
                  {selectedReservation.specialRequests}
                </p>
              </div>
            )}
            
            {selectedReservation.notes && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Internal Notes</h3>
                <p className="text-gray-700 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  {selectedReservation.notes}
                </p>
              </div>
            )}
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Created: {new Date(selectedReservation.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;
