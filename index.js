import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import fs from "fs";

const typeDefs = fs.readFileSync('./graphql/schema.graphql', 'utf8');

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
        }
        // createUser: (parent, { input }) => {
        //     const newUser = { id: input.id, email: input.email, password: input.password };
        //     user.push(newUser);
        //     return newUser;
        // },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    listen: { port: 8080 },
});

console.log(`🚀  Server ready at ${url}`);