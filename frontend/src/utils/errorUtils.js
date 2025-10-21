// API error types
export const API_ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
};

// Error handler class
export class APIError extends Error {
  constructor(type, message, details = null) {
    super(message);
    this.type = type;
    this.details = details;
    this.timestamp = new Date();
  }
}

// Error handler utility
export const handleAPIError = (error) => {
  console.log('Handling API error:', error);
  
  if (error.response) {
    // Server responded with an error
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
      case 403:
        return new APIError(
          API_ERROR_TYPES.AUTH_ERROR,
          'Authentication failed. Please check your credentials.',
          data
        );
      case 404:
        return new APIError(
          API_ERROR_TYPES.NOT_FOUND,
          'Resource not found. The requested data could not be located.',
          data
        );
      case 422:
        return new APIError(
          API_ERROR_TYPES.VALIDATION_ERROR,
          data.message || 'Validation failed. Please check your input.',
          data
        );
      default:
        return new APIError(
          API_ERROR_TYPES.SERVER_ERROR,
          'Server error occurred. Please try again later.',
          data
        );
    }
  }
  
  if (error.request) {
    // Request was made but no response received - likely a network issue or backend unavailable
    console.log('Network error - no response received:', error.request);
    return new APIError(
      API_ERROR_TYPES.NETWORK_ERROR,
      'Network error occurred. Please check your connection or the server may be down.',
      error.request
    );
  }
  
  // Something else went wrong
  console.log('Unknown error:', error);
  return new APIError(
    API_ERROR_TYPES.SERVER_ERROR,
    error.message || 'An unexpected error occurred.'
  );
};