import React from 'react'
import FriendList from './showfriends'
import SendFriendRequest from './sendfriend'
import PendingFriendRequests from './respondfriend'

const Friends = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-auth-back">
        <div className="flex-1 p-8 mt-28 overflow-auto">
          <div className="flex flex-col gap-6 items-center lg:flex-row">
            <div className="sm:h-64 sm:w-96 sm:rounded-3xl sm:text-xl lg:h-96 lg:w-1/2 flex items-center justify-center bg-gray-950 rounded-full lg:rounded-3xl lg:text-3xl">
<SendFriendRequest/>
            </div>
            <div className="sm:h-64 sm:w-96 sm:rounded-3xl sm:text-xl lg:h-96 lg:w-1/2 flex items-center justify-center bg-gray-950 rounded-full lg:rounded-3xl lg:text-3xl">
<PendingFriendRequests/>
            </div>
            <div className="sm:h-64 sm:w-96 sm:rounded-3xl sm:text-xl lg:h-96 lg:w-1/2 flex items-center justify-center bg-gray-950 rounded-full lg:rounded-3xl lg:text-3xl">
           <FriendList/>
            </div>
          </div>
        </div>
  </div>
  )
}

export default Friends