import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      username
      age
      nationality
    }
  }
`

export const UPDATE_USERNAME = gql`
  mutation UpdateUsername($input: UpdateUserNameInput!) {
    updateUserName(input: $input) {
      id
      name
      username
    }
  }
`