// utils/cache-manager.ts
export class CacheManager {
  private prefix = "graphql-cache:";
  private defaultTTL = 1000 * 60 * 60; // 1 hour

  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  set(
    key: string,
    entry: { data: any; timestamp: number },
    ttl: number = this.defaultTTL
  ): void {
    if (!this.isClient()) return;
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
    if (!this.isClient()) return null;
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const cacheEntry = JSON.parse(item);
      if (Date.now() - cacheEntry.timestamp > cacheEntry.ttl) {
        this.delete(key);
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

  delete(key: string): void {
    if (!this.isClient()) return;
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (!this.isClient()) return;
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
  }
}
