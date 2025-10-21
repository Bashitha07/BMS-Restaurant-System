import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, UsersIcon, TrashIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import axios from '../../utils/axios';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '',
    specialRequests: '',
  });

  // Fetch reservations from backend
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/reservations/my-reservations');
      console.log('Fetched reservations from backend:', response.data);
      setReservations(response.data);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
      setError('Failed to load reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('res', '').toLowerCase();
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.guests) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const reservationData = {
        reservationDate: formData.date,
        reservationTime: formData.time,
        partySize: parseInt(formData.guests),
        specialRequests: formData.specialRequests || '',
        status: 'PENDING'
      };

      console.log('Submitting reservation:', reservationData);
      const response = await axios.post('/api/reservations', reservationData);
      console.log('Reservation created:', response.data);
      
      alert('Reservation submitted successfully! Awaiting confirmation.');
      
      // Reset form
      setFormData({
        date: '',
        time: '',
        guests: '',
        specialRequests: '',
      });
      
      // Refresh reservations list
      fetchReservations();
    } catch (err) {
      console.error('Failed to create reservation:', err);
      alert('Failed to submit reservation. Please try again.');
    }
  };

  const cancelReservation = async (id) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await axios.delete(`/api/reservations/${id}`);
      alert('Reservation cancelled successfully');
      fetchReservations();
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
      alert('Failed to cancel reservation. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Table Reservations</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={fetchReservations} 
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

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
                .filter((res) => res.status?.toLowerCase() !== 'cancelled')
                .map((reservation) => (
                  <div key={reservation.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-lg">Reservation #{reservation.id}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                          reservation.status
                        )}`}
                      >
                        {reservation.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <CalendarIcon size={18} className="mr-2 text-indigo-500" />
                        <span>
                          {new Date(reservation.reservationDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <ClockIcon size={18} className="mr-2 text-indigo-500" />
                        <span>{reservation.reservationTime || 'Not set'}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <UsersIcon size={18} className="mr-2 text-indigo-500" />
                        <span>
                          {reservation.partySize} {reservation.partySize === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      {reservation.specialRequests && (
                        <div className="text-sm text-gray-600 mt-2">
                          <strong>Special Requests:</strong> {reservation.specialRequests}
                        </div>
                      )}
                    </div>
                    {reservation.status?.toLowerCase() === 'pending' && (
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
              <div>
                <label
                  htmlFor="resSpecialrequests"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Special Requests (Optional)
                </label>
                <textarea
                  id="resSpecialrequests"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  placeholder="Any dietary restrictions, allergies, or special occasions..."
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                />
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
}