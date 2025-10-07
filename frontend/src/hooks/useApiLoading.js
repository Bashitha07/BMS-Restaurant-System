import { useState, useCallback } from 'react';

export const useApiLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const wrapWithLoading = useCallback(async (asyncFn) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFn();
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, wrapWithLoading };
};