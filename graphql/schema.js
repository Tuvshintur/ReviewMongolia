const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Place {
        _id: ID!
        title: String!
        description: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        places: [Place!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type PlaceData {
        places: [Place!]!
        totalPlaces: Int!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PlaceInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        places(page: Int): PlaceData!
        place(id: ID!): Place!
        user: User!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPlace(placeInput: PlaceInputData): Place!
        updatePlace(id: ID!, placeInput: PlaceInputData): Place!
        deletePlace(id: ID!): Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
