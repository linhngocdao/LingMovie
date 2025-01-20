export const isValidNumber = (value: any): boolean => {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return !isNaN(Number(value));
  return false;
};

export const sanitizeString = (value: any): string | undefined => {
  if (typeof value !== 'string') return undefined;
  return value.trim() || undefined;
};

export const validatePaginationParams = (
  page?: any,
  limit?: any
): { page: number; limit: number } => {
  return {
    page: Math.max(1, Number(page) || 1),
    limit: Math.min(100, Math.max(1, Number(limit) || 24))
  };
}; 
