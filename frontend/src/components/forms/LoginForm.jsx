import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function LoginForm({ onClose, showRegister }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    clearErrors
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    clearErrors();
    console.log('Attempting login with:', data.username);
    
    try {
      const result = await login(data.username, data.password);
      console.log('Login result:', result);
      toast.success(`Login successful! Welcome ${result.username}!`);
      
      if (onClose) onClose();
      
      // Navigate to the intended page or home page
      const from = location.state?.from?.pathname || '/';
      console.log("Login successful, navigating to:", from);
      
      // Increased timeout to ensure state updates are complete
      setTimeout(() => {
        console.log('Executing navigation to:', from);
        navigate(from, { replace: true });
      }, 300);
    } catch (err) {
      console.error('Login error caught in form:', err);
      setFormError('root', { 
        type: 'manual',
        message: err.message || 'Invalid username or password'
      });
      toast.error(err.message || 'Failed to login');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
          {errors.root.message}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-black">
          Username
        </label>
        <input
          id="username"
          type="text"
          aria-invalid={errors.username ? "true" : "false"}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black bg-white ${
            errors.username ? 'border-red-300' : 'border-orange-500'
          }`}
          placeholder="Enter your username"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters'
            }
          })}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600" role="alert">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-black">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            aria-invalid={errors.password ? "true" : "false"}
            className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black bg-white ${
              errors.password ? 'border-red-300' : 'border-orange-500'
            }`}
            placeholder="Enter your password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-500 hover:text-black"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600" role="alert">{errors.password.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-orange-500 rounded-md shadow-sm text-sm font-bold text-black bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </div>

      {showRegister && (
        <div className="text-center">
          <p className="text-sm text-black">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={showRegister}
              className="font-bold text-orange-500 hover:text-black focus:outline-none focus:underline"
            >
              Sign up here
            </button>
          </p>
        </div>
      )}
    </form>
  );
}