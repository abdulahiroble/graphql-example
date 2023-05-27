import { ApolloServer } from '@apollo/server';
import { PubSub } from 'graphql-subscriptions';
import { startStandaloneServer } from '@apollo/server/standalone';
import fs from "fs";

const typeDefs = fs.readFileSync('./graphql/schema.graphql', 'utf8');

const pubsub = new PubSub();
const NEW_MESSAGE = 'NEW_MESSAGE';

const user = [
    {
        id: '2610',
        email: 'aroble48@gmail.com',
        password: '123456',
    },
];


const resolvers = {
    Query: {
        user: () => user
    },
    Mutation: {
        createUser: (_, { email, password }) => {
            const newUser = { id: user.length + 1, email: email, password: password };
            user.push(newUser);
            return newUser;
        },
        updateUser: (_, { id, email }) => {
            const index = user.findIndex((user) => user.id === id);

            if (index === -1) {
                // User with the specified ID not found
                return null; // or throw an appropriate error
            }

            user[index].email = email;

            return user[index];
        },
        deleteUser: (_, { id }) => {
            const index = user.findIndex((user) => user.id === id);
            user.splice(index, 1);
            return true;
        },
        createMessage: (_, { content }) => {
            const newMessage = {
                id: '1',
                content,
            };
            pubsub.publish('NEW_MESSAGE', { newMessage });
            return newMessage;
        },
    },
    Subscription: {
        newMessage: {
            subscribe: () => pubsub.asyncIterator(NEW_MESSAGE),
        },
    }
};

// const handleNewMessage = (message) => {
//     pubsub.publish(NEW_MESSAGE, { newMessage: message });
// }

// handleNewMessage("Hello World");

// Trigger the subscription when a new message is created
// For example, when a new message is added to the database
const handleNewMessage = (message) => {
    pubsub.publish('NEW_MESSAGE', { newMessage: message });
};

// Example usage
handleNewMessage({ id: '1', content: 'Hello, World!' });

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    listen: { port: 8080 },
});

console.log(`🚀  Server ready at ${url}`);