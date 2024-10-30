import { useEffect, useRef, useState } from "react";
import { useQuery, DocumentNode } from "@apollo/client";
import { getCache, setCache } from "@/utils/cache-manager";
import { OperationDefinitionNode } from "graphql";

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export function useQueryWithCache<T>(
  queries: DocumentNode[],
  cacheKeys: string[]
) {
  const [cachedData, setCachedData] = useState<{
    [key: string]: CachedData<unknown>;
  }>({});

  const queryRef = useRef<DocumentNode>();
  const isMounted = useRef(false);

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

  // Initial cache load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const allCachedData: { [key: string]: CachedData<unknown> } = {};

    cacheKeys.forEach((key) => {
      const cached = getCache(key);
      if (cached?.data) {
        allCachedData[key] = cached;
      }
    });

    if (Object.keys(allCachedData).length > 0) {
      setCachedData(allCachedData);
    }
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const hasValidCache = Object.keys(cachedData).length === cacheKeys.length;

  console.log("hasValidCache", hasValidCache);

  const { loading, error, data } = useQuery(queryRef.current, {
    skip: typeof window === "undefined" || hasValidCache,
  });

  // Handle data updates and caching
  useEffect(() => {
    if (!data || !isMounted.current) return;

    const newCacheData: { [key: string]: CachedData<unknown> } = {};

    Object.entries(data).forEach(([operationName, resultData], index) => {
      const cacheKey = cacheKeys[index];
      const newCacheEntry = {
        data: { [operationName]: resultData },
        timestamp: Date.now(),
      };
      setCache(cacheKey, newCacheEntry);
      newCacheData[cacheKey] = newCacheEntry;
    });

    setCachedData(newCacheData);
  }, [data]);

  const hasCache = Object.keys(cachedData).length > 0;
  const isFromCache = cacheKeys.map((key) => !!cachedData[key]);

  // Combine cached and fresh data
  const combinedData = cacheKeys.reduce((acc, key) => {
    const cached = cachedData[key]?.data;
    const fresh = data && data[key];
    return { ...acc, [key]: fresh || cached || {} };
  }, {} as T);

  return {
    data: combinedData,
    loading: loading && !hasCache,
    error,
    timestamps: cacheKeys.map((key) => cachedData[key]?.timestamp),
    isFromCache,
  };
}
