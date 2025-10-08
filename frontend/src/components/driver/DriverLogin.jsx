import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import driverService from '../../services/driverService';

const DriverLogin = ({ onLogin, showRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await driverService.login(formData);
      onLogin(response.driver);
      navigate('/driver/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Driver Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your delivery dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Sign-up link for drivers */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              New driver?{' '}
              {showRegister ? (
                <button
                  type="button"
                  onClick={showRegister}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                >
                  Apply to join our delivery team
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/driver/register')}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                >
                  Apply to join our delivery team
                </button>
              )}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Need help? <a href="/contact" className="text-blue-600 hover:text-blue-500">Contact support</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;