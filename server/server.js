// @ts-check
const { createServer } = require('http');
const express = require('express');
const { execute, subscribe } = require('graphql');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = require('./graphql/typeDefs');
const contextMiddleware = require('./utils/contextMiddleware');

const messages = [];

(async () => {
  const PORT = 4000;
  const pubsub = new PubSub();
  const app = express();
  const httpServer = createServer(app);

  const resolvers = {
    Query: {
      getMessages: () => messages,
    },
    Mutation: {
      postMessage: (_, { user, content }) => {
        const id = messages.length + 1;
        const message = {
          id,
          user,
          content,
        };
        messages.push(message);
        pubsub.publish('NEW_MESSAGE', { newMessage: message });
        return id;
      },
    },
    Subscription: {
      newMessage: {
        subscribe: () => pubsub.asyncIterator('NEW_MESSAGE'),
      },
    },
  };

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: contextMiddleware,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`);
  });
})();
