import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const Notification = ({
  type = 'info',
  title,
  message,
  autoClose = true,
  duration = 5000,
  onClose,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  }

  const Icon = icons[type]

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg border p-4 ${styles[type]} ${className}`}
    >
      <div className="flex items-start">
        <Icon className={`w-5 h-5 mt-0.5 mr-3 ${iconColors[type]}`} />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-medium mb-1">{title}</h4>
          )}
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            if (onClose) onClose()
          }}
          className="ml-3 inline-flex text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

Notification.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  autoClose: PropTypes.bool,
  duration: PropTypes.number,
  onClose: PropTypes.func,
  className: PropTypes.string,
}

export default Notification