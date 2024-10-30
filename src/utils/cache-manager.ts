// utils/cache-manager.ts
const PREFIX = "graphql-cache:";
const DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

export function setCache(
  key: string,
  entry: { data: unknown; timestamp: number },
  ttl: number = DEFAULT_TTL
): void {
  if (typeof window === "undefined") return;

  try {
    const cacheEntry = {
      data: entry.data,
      timestamp: entry.timestamp,
      ttl,
    };
    localStorage.setItem(PREFIX + key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error("Failed to save to cache:", error);
  }
}

export function getCache(
  key: string
): { data: unknown; timestamp: number } | null {
  if (typeof window === "undefined") return null;

  try {
    const item = localStorage.getItem(PREFIX + key);
    if (!item) return null;

    const cacheEntry = JSON.parse(item);

    // Check if cache is valid
    if (Date.now() - cacheEntry.timestamp > cacheEntry.ttl) {
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

export function isValidCache(key: string): boolean {
  const cached = getCache(key);
  return cached !== null;
}

export function deleteCache(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PREFIX + key);
}

export function clearCache(): void {
  if (typeof window === "undefined") return;
  Object.keys(localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}
