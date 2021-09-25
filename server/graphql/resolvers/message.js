const messages = [];

module.exports = {
  Query: {
    getMessages: () => messages,
  },
  Mutation: {
    postMessage: (_, { user, content }, { pubsub }) => {
      const id = messages.length * Math.random() * 100;
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
      subscribe: ({ pubsub }) => pubsub.asyncIterator('NEW_MESSAGE'),
    },
    getMessages: {
      subscribe: ({ pubsub }) => pubsub.asyncIterator('NEW_MESSAGE'),
    },
  },
};
