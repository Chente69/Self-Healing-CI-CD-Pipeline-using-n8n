const userList = [
    {
        id: 1,
        name: "John Doe",
        username: "johndoe",
        age: 28,
        nationality: "AMERICAN",
        friends: [{
        id: 4,
        name: "Paul Mackarney",
        username: "paulmackarney",
        age: 34,
        nationality: "COLLOMBIAN",
    }]
    },
    {
        id: 2,
        name: "Jane Smith",
        username: "janesmith",
        age: 32,
        nationality: "CANADIAN",
        friends: [{
        id: 3,
        name: "Michel Rood",
        username: "michelrood",
        age: 30,
        nationality: "BRAZILIAN"
    },
        {
        id: 4,
        name: "Paul Mackarney",
        username: "paulmackarney",
        age: 34,
        nationality: "COLLOMBIAN"
    }
]
    },
    {
        id: 3,
        name: "Michel Rood",
        username: "michelrood",
        age: 30,
        nationality: "BRAZILIAN"
    },
    {
        id: 4,
        name: "Paul Mackarney",
        username: "paulmackarney",
        age: 34,
        nationality: "COLLOMBIAN"
    }
];
const moviesList = [
    {
        id: 1,
        name: "Inception",
        yearOfPublication: 2010,
        isInTheaters: false
    },
    {
        id: 2,
        name: "Interstellar",
        yearOfPublication: 2014,
        isInTheaters: false
    },
    {
        id: 3,
        name: "The Dark Knight",
        yearOfPublication: 2008,
        isInTheaters: false
    }
];

module.exports = { userList , moviesList};
