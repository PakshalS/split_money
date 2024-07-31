import React from 'react';
import FriendList from './showfriends';
import SendFriendRequest from './sendfriend';
import PendingFriendRequests from './respondfriend';
import Navigationbar from '../navbar';

const Friends = () => {
  return (
    <div className='bg-auth-back h-screen'>
  <Navigationbar/>
  <div className="flex flex-col mt-8  p-4 lg:p-8">
      <div className="mt-12 lg:mt-24 flex flex-col lg:flex-row gap-8 justify-center items-center">
        <div className="w-full lg:w-1/3 bg-gray-950 rounded-lg shadow-lg p-6 flex items-center justify-center">
          <SendFriendRequest />
        </div>
        <div className="w-full lg:w-1/3 bg-gray-950 rounded-lg shadow-lg p-6 flex items-center justify-center">
          <PendingFriendRequests />
        </div>
        <div className="w-full lg:w-1/3 bg-gray-950 rounded-lg shadow-lg p-6 flex items-center justify-center">
          <FriendList />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Friends;
