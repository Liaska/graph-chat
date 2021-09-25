import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';

import { GET_MESSAGES, NEW_MESSAGE, POST_MESSAGE } from '../init/client-api';
import Message from './message/Message';

interface IMessage {
  user: string;
  content: string;
}

interface IMessageWithId extends IMessage {
  id: string | number;
}

const Chat = () => {
  const { data: messagesData } = useQuery(GET_MESSAGES);
  const { data: newMessage } = useSubscription(NEW_MESSAGE);

  const [messageState, setMessageState] = useState<IMessage>({
    user: 'Jack',
    content: '',
  });

  const [chatMessages, setChatMessages] = useState<IMessageWithId[]>([]);

  useEffect(() => {
    if (messagesData?.getMessages) {
      setChatMessages(messagesData?.getMessages);
    }
  }, [messagesData]);

  useEffect(() => {
    if (newMessage?.newMessage) {
      setChatMessages((prev) => [...prev, newMessage.newMessage]);
    }
  }, [newMessage]);

  const [postMessage] = useMutation(POST_MESSAGE, {
    onError: (err) => console.log(err),
  });

  const handlePostMessage = () => {
    if (messageState.content.length > 0) {
      postMessage({
        variables: messageState,
      });
    }
    setMessageState({
      ...messageState,
      content: '',
    });
  };

  return (
    <div>
      {chatMessages.length > 0 &&
        chatMessages?.map(({ id, user, content }: IMessageWithId) => (
          <Message key={id} content={content} user={user} author={user === messageState.user} />
        ))}
      <div className='chat-field'>
        <input
          type='text'
          className='user-name'
          value={messageState.user}
          onChange={(evt) =>
            setMessageState({
              ...messageState,
              user: evt.target.value,
            })
          }
        />
        <input
          type='text'
          className='user-message'
          value={messageState.content}
          onChange={(evt) =>
            setMessageState({
              ...messageState,
              content: evt.target.value,
            })
          }
        />
        <button onClick={handlePostMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
