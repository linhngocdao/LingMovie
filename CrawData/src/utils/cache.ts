interface CacheItem {
  value: any;
  expiry: number;
}

class CacheManager {
  private cache: Map<string, CacheItem>;

  constructor() {
    this.cache = new Map();
    // Tự động dọn cache hết hạn mỗi giờ
    setInterval(() => this.cleanExpiredCache(), 3600000);
  }

  async get(key: string): Promise<any | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();
