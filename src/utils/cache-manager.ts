// utils/cache-manager.ts
export class CacheManager {
  private prefix = "graphql-cache:";
  private defaultTTL = 1000 * 60 * 60; // 1 hour

  set(
    key: string,
    entry: { data: any; timestamp: number },
    ttl: number = this.defaultTTL
  ): void {
    if (typeof window === "undefined") return;

    try {
      const cacheEntry = {
        data: entry.data,
        timestamp: entry.timestamp,
        ttl,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error("Failed to save to cache:", error);
    }
  }

  get(key: string): { data: any; timestamp: number } | null {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const cacheEntry = JSON.parse(item);

      // Check if cache is valid
      if (Date.now() - cacheEntry.timestamp > cacheEntry.ttl) {
        // Don't delete expired cache immediately - let it be replaced by fresh data
        return null;
      }

      return {
        data: cacheEntry.data,
        timestamp: cacheEntry.timestamp,
      };
    } catch (error) {
      console.error("Failed to retrieve from cache:", error);
      return null;
    }
  }

  isValid(key: string): boolean {
    const cached = this.get(key);
    return cached !== null;
  }

  delete(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (typeof window === "undefined") return;
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
  }
}
