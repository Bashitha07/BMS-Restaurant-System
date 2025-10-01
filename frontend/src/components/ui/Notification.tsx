import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, AlertCircleIcon, XIcon } from 'lucide-react';
interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  duration?: number;
  onClose: () => void;
}
export function Notification({
  type,
  message,
  duration = 5000,
  onClose
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };
  return <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'} ${type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
      {type === 'success' ? <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" /> : <AlertCircleIcon className="h-5 w-5 text-red-500 mr-3" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={handleClose} className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none">
        <XIcon className="h-4 w-4" />
      </button>
    </div>;
}