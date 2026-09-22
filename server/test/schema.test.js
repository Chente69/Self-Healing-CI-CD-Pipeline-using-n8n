const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { snapshotSeedData, restoreSeedData, assertNoErrors, runQuery } = require('./helpers');

describe('GraphQL integration (executeOperation)', () => {
    beforeEach(() => {
        restoreSeedData(snapshotSeedData());
    });

    describe('Query', () => {
        it('returns all users', async () => {
            const result = await runQuery('{ users { id name username age nationality } }');
            assertNoErrors(result);
            assert.equal(result.data.users.length, 4);
            assert.equal(result.data.users[0].name, 'John Doe');
        });

        it('returns a user with friends and favorite movies by id', async () => {
            const result = await runQuery(
                `query GetUser($id: ID!) {
                    user(id: $id) {
                        id name username
                        friends { id name }
                        favoritiesMovies { id name yearOfPublication isInTheaters }
                    }
                }`,
                { id: '1' }
            );
            assertNoErrors(result);
            assert.equal(result.data.user.name, 'John Doe');
            assert.equal(result.data.user.friends.length, 1);
            assert.equal(result.data.user.friends[0].name, 'Paul Mackarney');
            assert.equal(result.data.user.favoritiesMovies.length, 2);
        });

        it('surfaces a non-null error for an unknown user id', async () => {
            const result = await runQuery('{ user(id: "999") { id name } }');
            assert.equal(result.data, null);
            assert.ok(result.errors);
            assert.match(result.errors[0].message, /Cannot return null for non-nullable field Query\.user/);
        });

        it('returns all movies', async () => {
            const result = await runQuery('{ movies { id name yearOfPublication isInTheaters } }');
            assertNoErrors(result);
            assert.equal(result.data.movies.length, 3);
        });

        it('returns a movie by name', async () => {
            const result = await runQuery('{ movie(name: "Inception") { name yearOfPublication } }');
            assertNoErrors(result);
            assert.equal(result.data.movie.name, 'Inception');
            assert.equal(result.data.movie.yearOfPublication, 2010);
        });

        it('surfaces a non-null error for an unknown movie name', async () => {
            const result = await runQuery('{ movie(name: "Blade Runner") { name } }');
            assert.equal(result.data, null);
            assert.ok(result.errors);
            assert.match(result.errors[0].message, /Cannot return null for non-nullable field Query\.movie/);
        });
    });

    describe('Mutation', () => {
        it('creates a user and persists it across operations', async () => {
            const createResult = await runQuery(
                `mutation CreateUser($input: CreateUserInput!) {
                    createUser(input: $input) { id name username age nationality }
                }`,
                { input: { name: 'Ada Lovelace', username: 'ada', age: 36, nationality: 'GERMAN' } }
            );
            assertNoErrors(createResult);
            assert.equal(createResult.data.createUser.id, '5');
            assert.equal(createResult.data.createUser.name, 'Ada Lovelace');

            const usersResult = await runQuery('{ users { id } }');
            assertNoErrors(usersResult);
            assert.equal(usersResult.data.users.length, 5);
            assert.deepEqual(usersResult.data.users.map((u) => Number(u.id)), [1, 2, 3, 4, 5]);
        });

        it('creates a user with the COLLOMBIAN nationality', async () => {
            const result = await runQuery(
                `mutation CreateUser($input: CreateUserInput!) {
                    createUser(input: $input) { id nationality }
                }`,
                { input: { name: 'Carla', username: 'carla', age: 22, nationality: 'COLLOMBIAN' } }
            );
            assertNoErrors(result);
            assert.equal(result.data.createUser.nationality, 'COLLOMBIAN');
        });

        it('updates the username of an existing user', async () => {
            const result = await runQuery(
                `mutation UpdateUsername($input: UpdateUserNameInput!) {
                    updateUserName(input: $input) { id name username }
                }`,
                { input: { id: '1', newUserName: 'john_doe_new' } }
            );
            assertNoErrors(result);
            assert.equal(result.data.updateUserName.username, 'john_doe_new');

            const userResult = await runQuery('{ user(id: "1") { username } }');
            assertNoErrors(userResult);
            assert.equal(userResult.data.user.username, 'john_doe_new');
        });

        it('returns null (no error) when updating an unknown user id', async () => {
            const result = await runQuery(
                `mutation UpdateUsername($input: UpdateUserNameInput!) {
                    updateUserName(input: $input) { id username }
                }`,
                { input: { id: '999', newUserName: 'ghost' } }
            );
            assertNoErrors(result);
            assert.equal(result.data.updateUserName, null);
        });
    });
});