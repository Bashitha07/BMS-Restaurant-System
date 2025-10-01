import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Notification } from '../components/ui/Notification';
import { UserIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
type ProfileFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
export function Profile() {
  const {
    user
  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    watch
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: ''
    }
  });
  const newPassword = watch('newPassword');
  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotificationType('success');
      setNotificationMessage('Profile updated successfully!');
      setShowNotification(true);
      setIsEditing(false);
    } catch (error) {
      setNotificationType('error');
      setNotificationMessage('Failed to update profile. Please try again.');
      setShowNotification(true);
    }
  };
  if (!user) {
    return <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <p className="text-gray-600">
                Please log in to view your profile
              </p>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
        {showNotification && <Notification type={notificationType} message={notificationMessage} onClose={() => setShowNotification(false)} />}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-3 mr-4">
                  <UserIcon size={32} className="text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{user.name}</h2>
                  <p className="opacity-80">{user.email}</p>
                </div>
              </div>
            </div>
            {!isEditing ? <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <UserIcon size={18} className="mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MailIcon size={18} className="mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon size={18} className="mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">Not set</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon size={18} className="mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">Not set</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              </div> : <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4 mb-6">
                    <Input label="Full Name" placeholder="Enter your full name" error={errors.name?.message} required {...register('name', {
                  required: 'Name is required'
                })} />
                    <Input label="Email Address" type="email" placeholder="Enter your email" error={errors.email?.message} required disabled {...register('email')} />
                    <Input label="Phone Number" placeholder="Enter your phone number" error={errors.phone?.message} {...register('phone', {
                  pattern: {
                    value: /^[0-9+\s-]+$/,
                    message: 'Please enter a valid phone number'
                  }
                })} />
                    <Input label="Address" placeholder="Enter your address" error={errors.address?.message} {...register('address')} />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4 mb-6">
                    <Input label="Current Password" type="password" placeholder="Enter your current password" error={errors.currentPassword?.message} {...register('currentPassword')} />
                    <Input label="New Password" type="password" placeholder="Enter new password" error={errors.newPassword?.message} {...register('newPassword', {
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })} />
                    <Input label="Confirm New Password" type="password" placeholder="Confirm new password" error={errors.confirmNewPassword?.message} {...register('confirmNewPassword', {
                  validate: value => !newPassword || value === newPassword || 'Passwords do not match'
                })} />
                  </div>
                  <div className="flex space-x-4">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>}
          </div>
        </div>
      </div>
    </div>;
}