// hooks/useQueryWithCache.ts
import { useEffect, useState } from "react";
import { useQuery, DocumentNode } from "@apollo/client";
import { CacheManager } from "@/utils/cache-manager";

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export function useQueryWithCache<T>(query: DocumentNode, cacheKey: string) {
  const [cachedData, setCachedData] = useState<CachedData<T> | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Check cache on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cacheManager = new CacheManager();
    const cached = cacheManager.get(cacheKey);

    if (cached?.data) {
      setCachedData({
        data: cached.data,
        timestamp: cached.timestamp,
      });
    }
    setInitialized(true);
  }, [cacheKey]);

  // Always call useQuery, but control its behavior with skip
  const { loading, error, data } = useQuery<T>(query, {
    skip: !initialized || !!cachedData,
    onCompleted: (newData) => {
      if (!cachedData) {
        const cacheManager = new CacheManager();
        const newCacheEntry = {
          data: newData,
          timestamp: Date.now(),
        };
        cacheManager.set(cacheKey, newCacheEntry);
        setCachedData(newCacheEntry);
      }
    },
  });

  return {
    data: data || cachedData?.data,
    loading: loading && !cachedData,
    error: error && !cachedData,
    timestamp: cachedData?.timestamp,
    isFromCache: !!cachedData,
  };
}
