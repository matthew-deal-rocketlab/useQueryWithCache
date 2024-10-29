import { ApolloClient, InMemoryCache } from "@apollo/client";

export const createApolloClient = () => {
  return new ApolloClient({
    uri: "https://swapi-graphql.netlify.app/.netlify/functions/index",
    cache: new InMemoryCache({}),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first",
      },
      query: {
        fetchPolicy: "cache-first",
      },
    },
  });
};
