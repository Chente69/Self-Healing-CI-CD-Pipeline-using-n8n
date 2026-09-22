const assert = require('node:assert/strict');
const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('../schema');
const { userList, moviesList } = require('../data/data');

const server = new ApolloServer({ typeDefs, resolvers });

const clone = (value) => JSON.parse(JSON.stringify(value));

function snapshotSeedData() {
    return {
        users: clone(userList),
        movies: clone(moviesList)
    };
}

function restoreSeedData(seed) {
    userList.splice(0, userList.length, ...seed.users);
    moviesList.splice(0, moviesList.length, ...seed.movies);
}

function assertNoErrors(result) {
    assert.deepEqual(result.errors, undefined, `expected no errors, got: ${JSON.stringify(result.errors)}`);
}

async function runQuery(query, variables) {
    return server.executeOperation({ query, variables });
}

module.exports = { server, snapshotSeedData, restoreSeedData, assertNoErrors, runQuery };