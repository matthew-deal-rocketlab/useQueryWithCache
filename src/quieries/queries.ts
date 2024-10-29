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

export const GET_CHARACTERS = gql`
  query {
    allPeople(first: 3) {
      # Return the first 3 items
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
