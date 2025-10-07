import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { XIcon } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuth } from '../../contexts/AuthContext'

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}) {
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setError('')
    setIsLoading(true)
    try {
      await login(data.username, data.password)
      onClose()
    } catch (err) {
      setError('Invalid username or password')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Log In</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            error={errors.username?.message}
            required
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            required
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Log In
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-orange-600 hover:underline"
            >
              Register
            </button>
          </p>
        </div>
        <div className="mt-4 border-t pt-4">
          <p className="text-sm text-gray-500 mb-2">Demo credentials:</p>
          <p className="text-sm text-gray-500">
            Admin: admin / admin123
          </p>
          <p className="text-sm text-gray-500">
            User: user / user123
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
