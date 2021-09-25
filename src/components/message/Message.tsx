import React from 'react';
import User from '../user/User';

import './style.css';

interface Props {
  user: string;
  content: string;
  author?: boolean;
}

const Message = ({ content, user, author }: Props) => {
  return (
    <div className={`message ${author ? 'isAuthor' : ''}`}>
      <User userName={user} />
      <p className='message-content'>{content}</p>
    </div>
  );
};

export default Message;
