import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios';

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    timeSlot: '',
    tableNumber: '',
    numberOfPeople: 1,
    specialRequests: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    } else {
      setAvailableSlots([]);
      setAvailableTables([]);
      setFormData(prev => ({ ...prev, timeSlot: '', tableNumber: '' }));
    }
  }, [formData.date]);

  // Fetch available tables when date and time slot change
  useEffect(() => {
    if (formData.date && formData.timeSlot) {
      fetchAvailableTables(formData.date, formData.timeSlot);
    } else {
      setAvailableTables([]);
      setFormData(prev => ({ ...prev, tableNumber: '' }));
    }
  }, [formData.date, formData.timeSlot]);

  const fetchAvailableSlots = async (date) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reservations/available-slots?date=${date}`);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      toast.error('Failed to fetch available time slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTables = async (date, timeSlot) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reservations/available-tables?date=${date}&timeSlot=${timeSlot}`);
      setAvailableTables(response.data);
    } catch (error) {
      console.error('Failed to fetch available tables:', error);
      toast.error('Failed to fetch available tables');
      setAvailableTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customerName || !formData.customerPhone || !formData.date || !formData.timeSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Construct the reservation data
      const reservationData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        reservationDateTime: `${formData.date}T${formData.timeSlot}:00`,
        timeSlot: formData.timeSlot,
        numberOfPeople: parseInt(formData.numberOfPeople),
        specialRequests: formData.specialRequests,
        status: 'PENDING',
        tableNumber: formData.tableNumber ? parseInt(formData.tableNumber) : null
      };

      await axios.post('/api/reservations', reservationData);
      toast.success('Reservation created successfully!');
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        date: '',
        timeSlot: '',
        tableNumber: '',
        numberOfPeople: 1,
        specialRequests: '',
      });
      setAvailableSlots([]);
      setAvailableTables([]);
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Make a Reservation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Details */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            required
            value={formData.customerName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
            Phone *
          </label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            required
            value={formData.customerPhone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            min={today}
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Time Slot Selection */}
        <div>
          <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">
            Available Time Slots *
          </label>
          {formData.date ? (
            <select
              id="timeSlot"
              name="timeSlot"
              required
              value={formData.timeSlot}
              onChange={handleChange}
              disabled={loading || availableSlots.length === 0}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {loading ? 'Loading slots...' : availableSlots.length === 0 ? 'No slots available' : 'Select a time slot'}
              </option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          ) : (
            <select
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
            >
              <option>Please select a date first</option>
            </select>
          )}
        </div>

        {/* Table Selection */}
        <div>
          <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">
            Preferred Table (Optional)
          </label>
          {formData.date && formData.timeSlot ? (
            <select
              id="tableNumber"
              name="tableNumber"
              value={formData.tableNumber}
              onChange={handleChange}
              disabled={loading || availableTables.length === 0}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {loading ? 'Loading tables...' : 
                 availableTables.length === 0 ? 'No tables available' : 
                 'Auto-assign table (or select preferred)'}
              </option>
              {availableTables.map(tableNum => (
                <option key={tableNum} value={tableNum}>
                  Table {tableNum}
                </option>
              ))}
            </select>
          ) : (
            <select
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
            >
              <option>Select date and time first</option>
            </select>
          )}
          {availableTables.length > 0 && (
            <p className="mt-1 text-sm text-green-600">
              {availableTables.length} table(s) available for this time slot
            </p>
          )}
        </div>

        <div>
          <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700">
            Number of People *
          </label>
          <input
            type="number"
            id="numberOfPeople"
            name="numberOfPeople"
            min="1"
            max="10"
            required
            value={formData.numberOfPeople}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows="3"
            value={formData.specialRequests}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Any special requirements or dietary restrictions..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !formData.date || !formData.timeSlot || availableSlots.length === 0}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Make Reservation'}
        </button>
      </form>
    </div>
  );
}