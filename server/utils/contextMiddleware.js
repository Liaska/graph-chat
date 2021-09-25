const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = (context) => {
  context.pubsub = pubsub;

  return context;
};
