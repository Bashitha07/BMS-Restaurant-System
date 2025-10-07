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
  if (error.response) {
    // Server responded with an error
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
      case 403:
        return new APIError(
          API_ERROR_TYPES.AUTH_ERROR,
          'Authentication failed',
          data
        );
      case 404:
        return new APIError(
          API_ERROR_TYPES.NOT_FOUND,
          'Resource not found',
          data
        );
      case 422:
        return new APIError(
          API_ERROR_TYPES.VALIDATION_ERROR,
          'Validation failed',
          data
        );
      default:
        return new APIError(
          API_ERROR_TYPES.SERVER_ERROR,
          'Server error occurred',
          data
        );
    }
  }
  
  if (error.request) {
    // Request was made but no response received
    return new APIError(
      API_ERROR_TYPES.NETWORK_ERROR,
      'Network error occurred',
      error.request
    );
  }
  
  // Something else went wrong
  return new APIError(
    API_ERROR_TYPES.SERVER_ERROR,
    error.message
  );
};