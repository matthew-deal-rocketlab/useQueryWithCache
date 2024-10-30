// hooks/useQueryWithCache.ts
import { useEffect, useRef, useState } from "react";
import { useQuery, DocumentNode } from "@apollo/client";
import { OperationDefinitionNode } from "graphql";
import { getCache, setCache } from "@/utils/cache-manager";

// hooks/useQueryWithCache.ts
export function useQueryWithCache<T>(
  queries: DocumentNode[],
  cacheKeys: string[],
  options?: {
    refetchInterval?: number;
  }
) {
  const [cachedData, setCachedData] = useState<{
    [key: string]: { data: unknown };
  }>(() => {
    if (typeof window === "undefined") return {};

    const initialCache: { [key: string]: { data: unknown } } = {};
    cacheKeys.forEach((key) => {
      const cached = getCache(key);
      if (cached?.data) {
        initialCache[key] = { data: cached.data };
      }
    });
    return initialCache;
  });

  const queryRef = useRef<DocumentNode>();

  // Create the query only once
  if (!queryRef.current) {
    const combinedSelections = queries.map((query) => {
      const queryDef = query
        .definitions[0] as unknown as OperationDefinitionNode;
      return queryDef.selectionSet.selections[0];
    });

    queryRef.current = {
      kind: "Document",
      definitions: [
        {
          kind: "OperationDefinition",
          operation: "query",
          name: { kind: "Name", value: "CombinedQuery" },
          variableDefinitions: [],
          directives: [],
          selectionSet: {
            kind: "SelectionSet",
            selections: combinedSelections,
          },
        },
      ],
    } as DocumentNode;
  }

  const hasValidCache = Object.keys(cachedData).length === cacheKeys.length;

  const { loading, error, data, refetch } = useQuery(queryRef.current, {
    skip: hasValidCache,
    onCompleted: (newData) => {
      if (!newData) return;

      const newCacheData: { [key: string]: { data: unknown } } = {};

      Object.entries(newData).forEach(([operationName, resultData], index) => {
        const cacheKey = cacheKeys[index];
        const newCacheEntry = {
          data: { [operationName]: resultData },
        };
        setCache(cacheKey, newCacheEntry);
        newCacheData[cacheKey] = newCacheEntry;
      });

      setCachedData(newCacheData);
    },
  });

  // Set up automatic refetching
  useEffect(() => {
    if (!options?.refetchInterval) return;

    const interval = setInterval(() => {
      refetch();
    }, options.refetchInterval);

    return () => clearInterval(interval);
  }, [options?.refetchInterval, refetch]);

  const isFromCache = cacheKeys.map((key) => !!cachedData[key]);

  const combinedData = hasValidCache
    ? cacheKeys.reduce((acc, key) => {
        return { ...acc, [key]: cachedData[key].data };
      }, {} as unknown as T)
    : data || {};

  return {
    data: combinedData,
    loading: loading && !hasValidCache,
    error,
    isFromCache,
    refetch,
  };
}
