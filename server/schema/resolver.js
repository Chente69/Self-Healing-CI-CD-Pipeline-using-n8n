const { userList ,moviesList} = require('../data/data');

const resolvers = {
    Query: {
        users: () => {
            return userList;
        },
        user: (_, {id}) => {
            return userList.find((user) => Number(user.id) === Number(id));
        },
        movies: () => {
            return moviesList;
        },  
        movie: (_, {name}) => {
            return moviesList.find((movie) => movie.name === name);
        }
    },
    User: {
        favoritiesMovies: () => {
            return moviesList.filter((movie) => movie.yearOfPublication>2008);
        }
    },
    
    Mutation: {
        createUser: (_, {input}) => {
            const lastId = userList[userList.length - 1].id;
            const newUser = {
                id: lastId + 1,
                ...input
            };
            userList.push(newUser);
            return newUser;
        },
        updateUserName: (_, {input}) => {
            const {id, newUserName} = input;
            const userToUpdate = userList.find((user) => Number(user.id) === Number(id));
            if(!userToUpdate){
                //throw new Error(`User with id ${id} not found`);
                return null;
            }
            userToUpdate.username = newUserName;
            return userToUpdate;
        }


    }

};

module.exports = { resolvers };
