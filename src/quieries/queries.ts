import { gql } from "@apollo/client";

export const GET_FILMS = gql`
  query {
    allFilms {
      films {
        title
        director
      }
    }
  }
`;
