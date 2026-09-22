const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        username: String!
        age: Int!
        nationality: Nacionality!
        friends: [User]
        favoritiesMovies: [Movie]
    }
    type Movie {
        id: ID!
        name: String!
        yearOfPublication: Int!
        isInTheaters: Boolean!
    }
    type Query {
        users: [User!]!
        user(id: ID!): User!
        movies: [Movie!]!
        movie(name: String!): Movie!
    }
    input CreateUserInput {
        name: String!
        username: String!
        age: Int!
        nationality: Nacionality = AMERICAN
    }

    input UpdateUserNameInput {
        id:ID!
        newUserName: String!

    }
    type Mutation {
        createUser(input: CreateUserInput!): User
        updateUserName(input: UpdateUserNameInput!): User
    }
    enum Nacionality {
        CANADIAN
        BRAZILIAN
        AMERICAN
        INDIAN
        CHINESE
        GERMAN
        COLLOMBIAN
    }
`;

module.exports = { typeDefs };
