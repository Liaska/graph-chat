import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query {
    getMessages {
      id
      user
      content
    }
  }
`;

export const POST_MESSAGE = gql`
  mutation ($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

export const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      id
      user
      content
    }
  }
`;
