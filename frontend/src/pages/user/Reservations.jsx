import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, UsersIcon, TrashIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function Reservations() {
  // Mock reservations data
  const [reservations, setReservations] = useState([
    {
      id: 'RES-1234',
      date: '2023-06-10',
      time: '19:00',
      guests: 4,
      status: 'confirmed',
    },
    {
      id: 'RES-1235',
      date: '2023-06-15',
      time: '20:00',
      guests: 2,
      status: 'pending',
    },
  ]);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id.replace('res', '').toLowerCase()]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new reservation
    const newReservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      date: formData.date,
      time: formData.time,
      guests: parseInt(formData.guests),
      status: 'pending',
    };
    setReservations([...reservations, newReservation]);
    // Reset form
    setFormData({
      date: '',
      time: '',
      guests: '',
    });
    // Show success message (in a real app, you might use a toast notification)
    alert('Reservation submitted successfully!');
  };

  const cancelReservation = (id) => {
    // In a real app, you would call an API to cancel the reservation
    setReservations(
      reservations.map((res) =>
        res.id === id
          ? {
              ...res,
              status: 'cancelled',
            }
          : res
      )
    );
  };

  const getStatusClass = (status) => {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Table Reservations</h1>
        {/* Current Reservations */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Your Reservations</h2>
          {reservations.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">You don't have any reservations yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {reservations
                .filter((res) => res.status !== 'cancelled')
                .map((reservation) => (
                  <div key={reservation.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-lg">Reservation #{reservation.id}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                          reservation.status
                        )}`}
                      >
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <CalendarIcon size={18} className="mr-2 text-indigo-500" />
                        <span>
                          {new Date(reservation.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <ClockIcon size={18} className="mr-2 text-indigo-500" />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <UsersIcon size={18} className="mr-2 text-indigo-500" />
                        <span>
                          {reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                    </div>
                    {reservation.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelReservation(reservation.id)}
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                      >
                        <TrashIcon size={16} className="mr-1" />
                        <span>Cancel Reservation</span>
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
        {/* New Reservation Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Book a New Reservation</h2>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="grid gap-6 mb-6">
              <div>
                <label
                  htmlFor="resDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="resDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="resTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Time
                </label>
                <select
                  id="resTime"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  value={formData.time}
                  onChange={handleInputChange}
                >
                  <option value="">Select a time</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="resGuests"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Guests
                </label>
                <select
                  id="resGuests"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  value={formData.guests}
                  onChange={handleInputChange}
                >
                  <option value="">Select number of guests</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5 People</option>
                  <option value="6">6 People</option>
                  <option value="7">7 People</option>
                  <option value="8">8+ People</option>
                </select>
              </div>
            </div>
            <Button
              type="submit"
              fullWidth
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Book Reservation
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
