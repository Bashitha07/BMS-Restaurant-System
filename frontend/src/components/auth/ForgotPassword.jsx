import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [step, setStep] = useState('request'); // 'request', 'verify', 'reset'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [requestForm, setRequestForm] = useState({
    email: ''
  });

  const [verifyForm, setVerifyForm] = useState({
    email: '',
    resetCode: ''
  });

  const [resetForm, setResetForm] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.requestPasswordReset(requestForm.email);
      setVerifyForm({ ...verifyForm, email: requestForm.email });
      setResetForm({ ...resetForm, email: requestForm.email });
      setStep('verify');
      setSuccess('Password reset code has been sent to your email. Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.verifyResetCode(verifyForm.email, verifyForm.resetCode);
      setResetForm({ ...resetForm, resetCode: verifyForm.resetCode });
      setStep('reset');
      setSuccess('Reset code verified successfully. Please enter your new password.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (resetForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword(
        resetForm.email,
        resetForm.resetCode,
        resetForm.newPassword
      );
      setSuccess('Password reset successfully! You can now login with your new password.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.requestPasswordReset(verifyForm.email);
      setSuccess('New reset code has been sent to your email.');
    } catch (err) {
      setError('Failed to resend reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBackToRequest = () => {
    setStep('request');
    setError('');
    setSuccess('');
    setVerifyForm({ email: '', resetCode: '' });
    setResetForm({ email: '', resetCode: '', newPassword: '', confirmPassword: '' });
  };

  const goBackToVerify = () => {
    setStep('verify');
    setError('');
    setSuccess('');
    setResetForm({ ...resetForm, newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto flex justify-center">
            <span className="text-4xl">🔐</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'request' && 'Forgot your password?'}
            {step === 'verify' && 'Enter reset code'}
            {step === 'reset' && 'Reset your password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'request' && 'Enter your email address and we\'ll send you a reset code'}
            {step === 'verify' && 'Enter the 6-digit code sent to your email'}
            {step === 'reset' && 'Enter your new password'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'request' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {step === 'request' ? '1' : '✓'}
          </div>
          <div className={`w-16 h-1 ${
            step === 'verify' || step === 'reset' ? 'bg-green-600' : 'bg-gray-300'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'verify' ? 'bg-blue-600 text-white' : 
            step === 'reset' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {step === 'verify' ? '2' : step === 'reset' ? '✓' : '2'}
          </div>
          <div className={`w-16 h-1 ${step === 'reset' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'reset' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            3
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              <span className="text-red-700">×</span>
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              <span className="text-green-700">×</span>
            </button>
          </div>
        )}

        {/* Step 1: Request Reset */}
        {step === 'request' && (
          <form className="mt-8 space-y-6" onSubmit={handleRequestSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={requestForm.email}
                  onChange={(e) => setRequestForm({ email: e.target.value })}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending reset code...
                  </div>
                ) : (
                  'Send reset code'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Back to login
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Verify Code */}
        {step === 'verify' && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifySubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="reset-code" className="block text-sm font-medium text-gray-700">
                  Reset Code
                </label>
                <input
                  id="reset-code"
                  name="resetCode"
                  type="text"
                  maxLength="6"
                  required
                  value={verifyForm.resetCode}
                  onChange={(e) => setVerifyForm({ ...verifyForm, resetCode: e.target.value.replace(/\D/g, '') })}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the 6-digit code sent to {verifyForm.email}
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || verifyForm.resetCode.length !== 6}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify code'
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={goBackToRequest}
                className="text-gray-600 hover:text-gray-500"
              >
                Change email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 'reset' && (
          <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={resetForm.newPassword}
                  onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={resetForm.confirmPassword}
                  onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="space-y-1">
                <li className={`flex items-center ${resetForm.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="mr-2">{resetForm.newPassword.length >= 8 ? '✓' : '○'}</span>
                  At least 8 characters long
                </li>
                <li className={`flex items-center ${resetForm.newPassword !== resetForm.confirmPassword || !resetForm.confirmPassword ? 'text-gray-500' : 'text-green-600'}`}>
                  <span className="mr-2">{resetForm.newPassword === resetForm.confirmPassword && resetForm.confirmPassword ? '✓' : '○'}</span>
                  Passwords match
                </li>
              </ul>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || resetForm.newPassword.length < 8 || resetForm.newPassword !== resetForm.confirmPassword}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resetting password...
                  </div>
                ) : (
                  'Reset password'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={goBackToVerify}
                className="text-gray-600 hover:text-gray-500 text-sm"
              >
                Back to verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;