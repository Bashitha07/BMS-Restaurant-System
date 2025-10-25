import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, UsersIcon, TrashIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import axios from '../../utils/axios';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when user starts typing
    if (submitError) setSubmitError(null);
    if (submitSuccess) setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Validate required fields
    if (!formData.date || !formData.time || !formData.guests) {
      setSubmitError('Please fill in all required fields (Date, Time, and Number of Guests)');
      return;
    }

    // Validate special requests length (optional but good UX)
    if (formData.specialRequests && formData.specialRequests.length > 500) {
      setSubmitError('Special requests must be less than 500 characters');
      return;
    }

    try {
      // Combine date and time into ISO format datetime
      const dateTimeString = `${formData.date}T${formData.time}:00`;
      
      const reservationData = {
        reservationDateTime: dateTimeString,
        numberOfPeople: parseInt(formData.guests),
        specialRequests: formData.specialRequests?.trim() || '',
        status: 'PENDING'
      };

      console.log('Submitting reservation:', reservationData);
      const response = await axios.post('/api/reservations', reservationData);
      console.log('Reservation created:', response.data);
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        date: '',
        time: '',
        guests: '',
        specialRequests: '',
      });
      
      // Refresh reservations list
      fetchReservations();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to create reservation:', err);
      
      // Extract detailed error message from API response
      let errorMessage = 'Failed to submit reservation. Please try again.';
      
      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          // Validation error
          if (data.message) {
            errorMessage = data.message;
          } else if (data.errors) {
            // Handle field-specific errors
            const fieldErrors = Object.entries(data.errors)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(', ');
            errorMessage = `Validation error: ${fieldErrors}`;
          } else {
            errorMessage = 'Invalid reservation data. Please check your inputs.';
          }
        } else if (status === 401) {
          errorMessage = 'You must be logged in to make a reservation.';
        } else if (status === 404) {
          errorMessage = 'Reservation service not found. Please contact support.';
        } else if (status === 409) {
          errorMessage = 'This time slot is no longer available. Please choose another time.';
        } else if (status === 500) {
          errorMessage = data.message || 'Server error. Please try again later or contact support.';
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else {
        // Error in request setup
        errorMessage = err.message || 'An unexpected error occurred.';
      }
      
      setSubmitError(errorMessage);
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-600 font-medium">Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-orange-600">Table Reservations</h1>
        
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
          <h2 className="text-2xl font-semibold mb-6 text-orange-600">Your Reservations</h2>
          {reservations.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md border border-orange-200">
              <p className="text-gray-600">You don't have any reservations yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {reservations
                .filter((res) => res.status?.toLowerCase() !== 'cancelled')
                .map((reservation) => (
                  <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6 border border-orange-200 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-lg text-gray-800">Reservation #{reservation.id}</h3>
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
                        <CalendarIcon size={18} className="mr-2 text-orange-500" />
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
                        <ClockIcon size={18} className="mr-2 text-orange-500" />
                        <span>{reservation.reservationTime || 'Not set'}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <UsersIcon size={18} className="mr-2 text-orange-500" />
                        <span>
                          {reservation.partySize} {reservation.partySize === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      {reservation.specialRequests && (
                        <div className="text-sm text-gray-600 mt-2 bg-orange-50 p-3 rounded-md">
                          <strong className="text-orange-600">Special Requests:</strong> {reservation.specialRequests}
                        </div>
                      )}
                    </div>
                    {reservation.status?.toLowerCase() === 'pending' && (
                      <button
                        onClick={() => cancelReservation(reservation.id)}
                        className="flex items-center text-red-500 hover:text-red-700 transition-colors"
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
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-orange-200">
          <h2 className="text-2xl font-semibold mb-6 text-center text-orange-600">Book a New Reservation</h2>
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800">Reservation Submitted Successfully!</h3>
                  <p className="text-sm text-green-700 mt-1">Your reservation is awaiting confirmation. We'll notify you once it's confirmed.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Reservation Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="grid gap-6 mb-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Time
                </label>
                <select
                  id="time"
                  name="time"
                  className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
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
                  htmlFor="guests"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Guests
                </label>
                <select
                  id="guests"
                  name="guests"
                  className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
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
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="specialRequests"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Special Requests (Optional)
                  </label>
                  <span className={`text-xs ${formData.specialRequests.length > 500 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {formData.specialRequests.length}/500
                  </span>
                </div>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-900 ${
                    formData.specialRequests.length > 500 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-orange-300 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                  rows="3"
                  maxLength="500"
                  placeholder="Any dietary restrictions, allergies, or special occasions..."
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                />
                {formData.specialRequests.length > 450 && (
                  <p className={`text-xs mt-1 ${formData.specialRequests.length > 500 ? 'text-red-600' : 'text-orange-600'}`}>
                    {formData.specialRequests.length > 500 
                      ? 'Special requests must be 500 characters or less' 
                      : `${500 - formData.specialRequests.length} characters remaining`}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              fullWidth
              className="bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium py-3"
              disabled={formData.specialRequests.length > 500}
            >
              Book Reservation
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}