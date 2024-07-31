
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const response = await axios.get('http://localhost:3000/friends/get-friends', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const removeFriend = async (friendId) => {
    try {
      setLoading(true);
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      await axios.delete(`http://localhost:3000/friends/${friendId}/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove friend from the state
      setFriends(friends.filter(friend => friend._id !== friendId));
      setSelectedFriend(null); // Reset selected friend
    } catch (error) {
      console.error('Error removing friend:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-950 shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Friends List</h2>
      <ul className="space-y-4">
        {friends.map((friend) => (
          <li key={friend._id} className="bg-gray-700 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-white">{friend.name}</p>
              <button
                className="text-sm text-blue-500 hover:text-blue-300"
                onClick={() => setSelectedFriend(friend._id === selectedFriend ? null : friend._id)}
              >
                {selectedFriend === friend._id ? 'Close' : 'Options'}
              </button>
            </div>
            {selectedFriend === friend._id && (
              <div className="mt-2">
                <button
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700"
                  onClick={() => removeFriend(friend._id)}
                  disabled={loading}
                >
                  {loading ? 'Removing...' : 'Remove Friend'}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
// import React, { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';
// import axios from 'axios';

// const FriendList = () => {
//   const [friends, setFriends] = useState([]);
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showFriends, setShowFriends] = useState(true);

//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         const token = Cookies.get('authToken');
//         if (!token) {
//           console.error('No auth token found');
//           return;
//         }

//         const response = await axios.get('http://localhost:3000/friends/get-friends', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setFriends(response.data);
//       } catch (error) {
//         console.error('Error fetching friends:', error);
//       }
//     };

//     fetchFriends();
//   }, []);

//   const removeFriend = async (friendId) => {
//     try {
//       setLoading(true);
//       const token = Cookies.get('authToken');
//       if (!token) {
//         console.error('No auth token found');
//         return;
//       }

//       await axios.delete(`http://localhost:3000/friends/${friendId}/remove`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setFriends(friends.filter(friend => friend._id !== friendId));
//       setSelectedFriend(null);
//     } catch (error) {
//       console.error('Error removing friend:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md bg-gray-950 shadow-lg rounded-lg p-6 mb-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-lg font-semibold text-white">Friends List</h2>
//         <button
//           className="text-sm text-blue-500 hover:text-blue-300"
//           onClick={() => setShowFriends(!showFriends)}
//         >
//           {showFriends ? 'Hide Friends' : 'Show Friends'}
//         </button>
//       </div>
//       {showFriends && (
//         <ul className="mt-4 space-y-4">
//           {friends.map((friend) => (
//             <li key={friend._id} className="bg-gray-700 p-4 rounded-md">
//               <div className="flex justify-between items-center">
//                 <p className="text-white">{friend.name}</p>
//                 <button
//                   className="text-sm text-blue-500 hover:text-blue-300"
//                   onClick={() => setSelectedFriend(friend._id === selectedFriend ? null : friend._id)}
//                 >
//                   {selectedFriend === friend._id ? 'Close' : 'Options'}
//                 </button>
//               </div>
//               {selectedFriend === friend._id && (
//                 <div className="mt-2">
//                   <button
//                     className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700"
//                     onClick={() => removeFriend(friend._id)}
//                     disabled={loading}
//                   >
//                     {loading ? 'Removing...' : 'Remove Friend'}
//                   </button>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default FriendList;