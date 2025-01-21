/**
 * Tạo độ trễ trong một khoảng thời gian
 * @param ms Thời gian trễ tính bằng milliseconds
 * @returns Promise void
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Tạo chuỗi ngẫu nhiên
 * @param length Độ dài chuỗi
 * @returns string
 */
export const generateRandomString = (length: number): string => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Format số lớn
 * @param num Số cần format
 * @returns string
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Kiểm tra giá trị có phải là object không
 * @param value Giá trị cần kiểm tra
 * @returns boolean
 */
export const isObject = (value: any): boolean => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Retry một function với số lần thử lại xác định
 * @param fn Function cần retry
 * @param retries Số lần thử lại
 * @param delay Thời gian delay giữa các lần thử (ms)
 * @returns Promise
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await delay(delayMs);
    return retry(fn, retries - 1, delayMs);
  }
};
