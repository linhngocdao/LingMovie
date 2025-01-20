interface PaginatedResponse<T> {
  status: boolean;
  total: number;
  page: number;
  limit: number;
  items: T[];
}

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => ({
  status: true,
  total,
  page,
  limit,
  items: data
});

export const createErrorResponse = (message: string) => ({
  status: false,
  message
});
