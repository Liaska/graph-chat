const { gql } = require('apollo-server-express');

module.exports = gql`
  type Message {
    id: ID!
    user: String!
    content: String!
  }
  type Query {
    getMessages: [Message!]
  }
  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }
  type Subscription {
    newMessage: Message!
  }
`;
