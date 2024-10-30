export function setCache(
  key: string,
  entry: { data: unknown },
  ttl: number = 1000 * 60 * 60
): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      `graphql-cache:${key}`,
      JSON.stringify({
        data: entry.data,
        expires: Date.now() + ttl,
      })
    );
  } catch (error) {
    console.error("Failed to save to cache:", error);
  }
}

export function getCache(key: string): { data: unknown } | null {
  if (typeof window === "undefined") return null;

  try {
    const item = localStorage.getItem(`graphql-cache:${key}`);
    if (!item) return null;

    const parsed = JSON.parse(item);

    // Check if cache has expired
    if (parsed.expires && Date.now() > parsed.expires) {
      localStorage.removeItem(`graphql-cache:${key}`);
      return null;
    }

    return { data: parsed.data };
  } catch (error) {
    console.error("Failed to retrieve from cache:", error);
    return null;
  }
}
