// import React, { useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const AddMemberForm = ({ groupId, onClose }) => {
//   const [members, setMembers] = useState([{ name: '', email: '' }]);
//   const [error, setError] = useState(null);

//   const handleAddMember = async () => {
//     const token = Cookies.get('authToken');
//     if (!token) {
//       console.error('No auth token found');
//       return;
//     }

//     // Validation: Check if at least one member with a name is added
//     const validMembers = members.filter(member => member.name.trim() !== '');
//     if (validMembers.length === 0) {
//       setError('Please add at least one member with a name.');
//       return;
//     }

//     try {
//       await axios.post(
//         `http://localhost:3000/groups/${groupId}/add-member`,
//         { members: validMembers },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert('Members added successfully!');
//       onClose();
//     } catch (error) {
//       console.error('Error adding members:', error);
//       setError('Failed to add members.');
//     }
//   };

//   const handleMemberChange = (index, field, value) => {
//     const newMembers = [...members];
//     newMembers[index][field] = value;
//     setMembers(newMembers);
//     setError(null); // Clear error when user makes a change
//   };

//   const addNewMemberField = () => {
//     setMembers([...members, { name: '', email: '' }]);
//   };

//   const removeMemberField = (index) => {
//     const newMembers = members.filter((_, i) => i !== index);
//     setMembers(newMembers);
//     setError(null); // Clear error if any member is removed
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-gray-950 p-6 rounded-md shadow-md w-96 relative">
//         <button onClick={onClose} className="absolute top-2 right-2 text-white">&times;</button>
//         <h2 className="text-xl font-bold mb-4 text-white">Add Members</h2>
//         {members.map((member, index) => (
//           <div key={index} className="mb-4">
//             <input
//               type="text"
//               placeholder="Name"
//               value={member.name}
//               onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
//               className="w-full mb-2 p-2 border border-gray-600 rounded bg-gray-700 text-white"
//             />
//             <input
//               type="email"
//               placeholder="Email (Optional)"
//               value={member.email}
//               onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
//               className="w-full mb-2 p-2 border border-gray-600 rounded bg-gray-700 text-white"
//             />
//             <button
//               onClick={() => removeMemberField(index)}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <button
//           onClick={addNewMemberField}
//           className="bg-gray-900 text-white px-4 py-2 rounded hover:text-green-500 transition duration-300 w-full mb-4"
//         >
//           Add Another Member
//         </button>
//         <button
//           onClick={handleAddMember}
//           className="bg-gray-900 text-white px-4 py-2 rounded hover:text-green-500 transition duration-300 w-full"
//         >
//           Add Members
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddMemberForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddMemberForm = ({ groupId, onClose }) => {
  const [members, setMembers] = useState([{ name: '', email: '' }]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);

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

  const handleAddMember = async () => {
    const token = Cookies.get('authToken');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    const validMembers = members.filter(member => member.name.trim() !== '');
    if (validMembers.length === 0) {
      setError('Please add at least one member with a name.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/groups/${groupId}/add-member`,
        { members: validMembers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Members added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding members:', error);
      setError('Failed to add members.');
    }
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
    setError(null);
  };

  const addNewMemberField = () => {
    setMembers([...members, { name: '', email: '' }]);
  };

  const removeMemberField = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
    setError(null);
  };

  const handleFriendSelect = (friend) => {
    const existingIndex = members.findIndex(
      (member) => member.email === friend.email
    );

    if (existingIndex !== -1) {
      return;
    }

    setMembers([...members, { name: friend.name, email: friend.email || '' }]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-950 p-6 rounded-md shadow-md w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-white">Add Members</h2>
        {members.map((member, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
              className="w-full mb-2 p-2 border border-gray-600 rounded bg-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Email (Optional)"
              value={member.email}
              onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
              className="w-full mb-2 p-2 border border-gray-600 rounded bg-gray-700 text-white"
            />
            <button
              onClick={() => removeMemberField(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Remove
            </button>
          </div>
        ))}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={addNewMemberField}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:text-green-500 transition duration-300 w-full mb-4"
        >
          Add Another Member
        </button>
        <button
          onClick={handleAddMember}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:text-green-500 transition duration-300 w-full"
        >
          Add Members
        </button>
        <div className="w-full mt-6">
          <h3
            className="text-xl font-semibold mb-2 text-white cursor-pointer"
            onClick={() => setIsFriendsListOpen(!isFriendsListOpen)}
          >
            {isFriendsListOpen ? 'Hide' : 'Show'} Friends List
          </h3>
          {isFriendsListOpen && (
            <div className="flex flex-wrap gap-4">
              {friends.map((friend) => (
                <div key={friend._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={() => handleFriendSelect(friend)}
                    className="form-checkbox h-5 w-5 text-green-500"
                  />
                  <label className="text-white">{friend.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMemberForm;
