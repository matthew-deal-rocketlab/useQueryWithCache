## useQueryWithCache Hook

The core functionality is provided by a custom React hook that:

- Combines multiple queries into one request
- Manages localStorage caching
- Handles data fetching and caching logic
- Provides loading and error states

```typescript
const { data, loading, error, isFromCache } = useQueryWithCache<DataType>(
  [QUERY_1, QUERY_2],
  ["cache-key-1", "cache-key-2"]
);
```

## Cache Manager

A utility that handles:

- Reading from localStorage
- Writing to localStorage
- Cache invalidation ( revalidates every hour )
- Error handling for storage operations

## Usage Example

```typescript
// Define your queries
const GET_FILMS = gql`
  query {
    allFilms {
      films {
        title
        director
      }
    }
  }
`;
const GET_CHARACTERS = gql`
  query {
    allPeople(first: 3) {
      people {
        id
        name
        homeworld {
          id
          name
        }
      }
    }
  }
`;
// Use the hook in your component
function MyComponent() {
  const { data, loading, error, isFromCache } = useQueryWithCache(
    [GET_FILMS, GET_CHARACTERS],
    ["films-cache", "characters-cache"]
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* Render your data */}</div>;
}
```

## Benefits

- Improved performance by reducing network requests
- Better user experience with immediate data loading from cache
- Reduced server load
- Smooth handling of SSR and client-side transitions

## Technical Requirements

- React
- Apollo Client
- Next.js
- Modern browser with localStorage support

## Notes

- Cache is stored in localStorage with configurable keys
- Initial server render matches client render to prevent hydration issues
- Loading states differentiate between initial loads and background updates
- TypeScript support included for type safety

This project provides a solution for caching GraphQL queries while maintaining good user experience and performance.
