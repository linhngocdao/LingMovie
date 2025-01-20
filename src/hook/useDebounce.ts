import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing a value
 * @template T
 * @param {T} value - The value to debounce
 * @param {number} delay - The debounce delay in milliseconds
 * @returns {T} - The debounced value
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (delay < 0) {
      throw new Error('Delay must be a positive number');
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
