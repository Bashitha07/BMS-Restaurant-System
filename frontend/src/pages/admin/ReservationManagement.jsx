import React, { useEffect, useState } from 'react';
import { SearchIcon, CalendarIcon, ClockIcon, UsersIcon, CheckIcon, XIcon, PhoneIcon, MailIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for reservations
  useEffect(() => {
    const mockReservations = [
      {
        id: 'RES-001',
        customerName: 'John Smith',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        date: '2023-05-25',
        time: '19:00',
        guests: 4,
        status: 'confirmed',
        specialRequests: 'Window seat preferred',
        createdAt: '2023-05-20'
      },
      {
        id: 'RES-002',
        customerName: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+94 77 234 5678',
        date: '2023-05-26',
        time: '20:00',
        guests: 2,
        status: 'pending',
        specialRequests: 'Birthday celebration',
        createdAt: '2023-05-21'
      },
      {
        id: 'RES-003',
        customerName: 'Michael Chen',
        email: 'michael@example.com',
        phone: '+94 77 345 6789',
        date: '2023-05-24',
        time: '18:30',
        guests: 6,
        status: 'cancelled',
        specialRequests: 'High chair needed',
        createdAt: '2023-05-19'
      }
    ];
    setReservations(mockReservations);
    setFilteredReservations(mockReservations);
  }, []);

  useEffect(() => {
    let filtered = reservations;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reservation =>
        reservation.customerName.toLowerCase().includes(query) ||
        reservation.email.toLowerCase().includes(query) ||
        reservation.phone.includes(query) ||
        reservation.id.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    setFilteredReservations(filtered);
  }, [searchQuery, statusFilter, reservations]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateReservationStatus = (id, newStatus) => {
    const updatedReservations = reservations.map(reservation =>
      reservation.id === id ? { ...reservation, status: newStatus } : reservation
    );
    setReservations(updatedReservations);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reservation Management</h1>
          <Button className="flex items-center gap-2">
            <CalendarIcon size={16} />
            <span>Add Reservation</span>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reservations by ID, customer name, email or phone..."
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
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
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
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No reservations found
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map(reservation => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created {reservation.createdAt}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.customerName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MailIcon size={14} />
                          {reservation.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <PhoneIcon size={14} />
                          {reservation.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <CalendarIcon size={14} />
                          {reservation.date}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <ClockIcon size={14} />
                          {reservation.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <UsersIcon size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-900">{reservation.guests}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                                title="Confirm Reservation"
                              >
                                <CheckIcon size={18} />
                              </button>
                              <button
                                onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                                title="Cancel Reservation"
                              >
                                <XIcon size={18} />
                              </button>
                            </>
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

export default ReservationManagement;
