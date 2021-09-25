import React from 'react';

import './style.css';

interface Props {
  userName: string;
}

const User = ({ userName }: Props) => {
  return <div className='user'>{userName}</div>;
};

export default User;
