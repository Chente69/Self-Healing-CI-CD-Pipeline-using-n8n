import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      username
      age
      nationality
      friends {
        id
        name
        username
      }
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      username
      age
      nationality
      friends {
        id
        name
        username
      }
      favoritiesMovies {
        id
        name
        yearOfPublication
        isInTheaters
      }
    }
  }
`

export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`