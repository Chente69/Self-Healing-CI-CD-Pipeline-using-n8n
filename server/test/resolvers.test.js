const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { resolvers } = require('../schema/resolver');
const { userList, moviesList } = require('../data/data');
const { snapshotSeedData, restoreSeedData } = require('./helpers');

describe('Resolver unit tests', () => {
    beforeEach(() => {
        restoreSeedData(snapshotSeedData());
    });

    describe('Query', () => {
        it('users returns all seeded users', () => {
            const result = resolvers.Query.users();
            assert.equal(result.length, 4);
            assert.deepEqual(result.map((u) => u.id), [1, 2, 3, 4]);
        });

        it('user returns the user matching the given id (string coercion)', () => {
            const result = resolvers.Query.user(null, { id: '1' });
            assert.equal(result.name, 'John Doe');
        });

        it('user returns undefined for an unknown id', () => {
            const result = resolvers.Query.user(null, { id: '999' });
            assert.equal(result, undefined);
        });

        it('movies returns all seeded movies', () => {
            const result = resolvers.Query.movies();
            assert.equal(result.length, 3);
        });

        it('movie returns the movie matching the given name', () => {
            const result = resolvers.Query.movie(null, { name: 'Inception' });
            assert.equal(result.yearOfPublication, 2010);
        });

        it('movie returns undefined for an unknown name', () => {
            const result = resolvers.Query.movie(null, { name: 'Blade Runner' });
            assert.equal(result, undefined);
        });
    });

    describe('User.favoritiesMovies', () => {
        it('returns only movies published after 2008 (current behavior)', () => {
            const result = resolvers.User.favoritiesMovies(null, null, { user: { id: 1 } });
            assert.equal(result.length, 2);
            assert.ok(result.every((movie) => movie.yearOfPublication > 2008));
            assert.ok(result.some((movie) => movie.name === 'Inception'));
            assert.ok(result.some((movie) => movie.name === 'Interstellar'));
        });
    });

    describe('Mutation', () => {
        it('createUser appends a user with the next id', () => {
            const result = resolvers.Mutation.createUser(null, {
                input: {
                    name: 'Ada Lovelace',
                    username: 'ada',
                    age: 36,
                    nationality: 'GERMAN'
                }
            });
            assert.equal(result.id, 5);
            assert.equal(result.name, 'Ada Lovelace');
            assert.equal(userList.length, 5);
            assert.deepEqual(userList[userList.length - 1], result);
        });

        it('updateUserName updates the username of an existing user', () => {
            const result = resolvers.Mutation.updateUserName(null, {
                input: { id: '1', newUserName: 'john_doe_new' }
            });
            assert.equal(result.id, 1);
            assert.equal(result.username, 'john_doe_new');
            assert.equal(userList[0].username, 'john_doe_new');
        });

        it('updateUserName returns null for an unknown id', () => {
            const result = resolvers.Mutation.updateUserName(null, {
                input: { id: '999', newUserName: 'ghost' }
            });
            assert.equal(result, null);
        });
    });
});