// utils/apollo-cache-client.ts
import { ApolloClient, gql } from "@apollo/client";
import { CacheManager } from "./cache-manager";
import { createApolloClient } from "./apollo-client";

export class ApolloCacheClient {
  private client: ApolloClient<any>;
  private cacheManager: CacheManager | null;

  constructor() {
    this.client = createApolloClient();
    this.cacheManager = null;

    if (typeof window !== "undefined") {
      this.cacheManager = new CacheManager();
      this.initializeCache();
    }
  }

  private initializeCache(): void {
    if (!this.cacheManager) return;

    // Try to restore cache first
    const cachedData = this.cacheManager.get("apollo-cache");
    if (cachedData?.data) {
      this.client.cache.restore(cachedData.data);
      console.log(
        "Cache restored from localStorage with timestamp:",
        new Date(cachedData.timestamp)
      );
    }

    // Set up cache persistence
    this.client.cache.watch({
      query: gql`
        query WatchCache {
          allFilms {
            films {
              title
              director
            }
          }
        }
      `,
      optimistic: true,
      callback: () => {
        // Only update cache if we don't have cached data or if it's expired
        if (!this.cacheManager) return;

        const existingCache = this.cacheManager.get("apollo-cache");
        if (!existingCache) {
          const cacheData = this.client.cache.extract();
          this.cacheManager.set("apollo-cache", {
            data: cacheData,
            timestamp: Date.now(),
          });
          console.log("Initial cache saved to localStorage");
        }
      },
    });
  }

  getClient(): ApolloClient<any> {
    return this.client;
  }

  clearCache(): void {
    if (this.cacheManager) {
      this.client.clearStore();
      this.cacheManager.clear();
    }
  }
}
