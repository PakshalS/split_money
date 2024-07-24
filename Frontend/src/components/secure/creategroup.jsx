  // import React, { useState, useEffect } from 'react';
  // import axios from 'axios';
  // import Cookies from 'js-cookie';
  // import { useNavigate } from 'react-router-dom';
  // import Navigationbar from '../navbar';

  // const GroupCreate = () => {
  //   const [groupName, setGroupName] = useState('');
  //   const [members, setMembers] = useState([{ name: '', email: '' }]);
  //   const [friends, setFriends] = useState([]);
  //   const navigate = useNavigate();

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

  //   const handleGroupNameChange = (e) => setGroupName(e.target.value);

  //   const handleMemberChange = (index, field, value) => {
  //     const newMembers = [...members];
  //     newMembers[index][field] = value;
  //     setMembers(newMembers);
  //   };

  //   const addMember = () => setMembers([...members, { name: '', email: '' }]);

  //   const removeMember = (index) => {
  //     const newMembers = members.filter((_, i) => i !== index);
  //     setMembers(newMembers);
  //   };

  //   const handleFriendSelect = (friend, index) => {
  //     const newMembers = [...members];
  //     newMembers[index] = { name: friend.name, email: friend.email || '' };
  //     setMembers(newMembers);
  //   };

  //   const handleSubmit = async () => {
  //     try {
  //       const hasEmptyName = members.some(member => !member.name.trim());
  //       if (!groupName.trim() || hasEmptyName) {
  //         alert('Group name and all member names are required.');
  //         return;
  //       }

  //       const token = Cookies.get('authToken');
  //       if (!token) {
  //         console.error('No auth token found');
  //         return;
  //       }

  //       const response = await axios.post('http://localhost:3000/groups/create', {
  //         name: groupName,
  //         members,
  //       }, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       console.log('Group created:', response.data);
  //       // Redirect to the created group page
  //       navigate(`/groups/${response.data.group._id}`);
  //     } catch (error) {
  //       console.error('Error creating group:', error);
  //     }
  //   };

  //   return (
  //     <div className="flex flex-col items-center bg-auth-back h-screen">
  //       <Navigationbar></Navigationbar>
  //       <div className='mt-24 bg-gray-950 flex-row items-center justify-center '>
  //       <div>
  //       <h2 className="text-xl font-semibold text-white mb-4">Create Group</h2>
  //         </div>
  //       <input
  //         type="text"
  //         placeholder="Group Name"
  //         value={groupName}
  //         onChange={handleGroupNameChange}
  //         className="mb-4 p-2 border rounded w-full max-w-md"
  //       />
  //       {members.map((member, index) => (
  //         <div key={index} className="flex items-center space-x-2 mb-2">
  //           <input
  //             type="text"
  //             placeholder="Member Name"
  //             value={member.name}
  //             onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
  //             className="p-2 border rounded w-full"
  //           />
  //           <input
  //             type="email"
  //             placeholder="Email (Optional)"
  //             value={member.email}
  //             onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
  //             className="p-2 border rounded w-full"
  //           />
  //           <button onClick={() => removeMember(index)} className="bg-red-500 text-white px-4 py-2 rounded">
  //             Remove
  //           </button>
  //         </div>
  //       ))}
  //       <button onClick={addMember} className="bg-black text-white hover:text-green-500 px-4 py-2 rounded mb-4">
  //         Add Member
  //       </button>
  //       <button onClick={handleSubmit} className="bg-black text-white  hover:text-green-500 px-4 py-2 rounded mb-4">
  //         Create Group
  //       </button>
  //       <div className="w-full max-w-md">
  //         <h3 className="text-lg font-semibold mb-2">Friends</h3>
  //         {friends.map((friend, index) => (
  //           <div key={friend._id} className="flex items-center space-x-2 mb-2">
  //             <input
  //               type="checkbox"
  //               onChange={(e) => handleFriendSelect(friend, index)}
  //               className="form-checkbox"
  //             />
  //             <label>{friend.name}</label>
  //           </div>
  //         ))}
  //       </div>
  //       </div>
        
  //     </div>
  //   );
  // };

  // export default GroupCreate;
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import Cookies from 'js-cookie';
  import { useNavigate } from 'react-router-dom';
  import Navigationbar from '../navbar';
  
  const GroupCreate = () => {
    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState([{ name: '', email: '' }]);
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();
  
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
  
    const handleGroupNameChange = (e) => setGroupName(e.target.value);
  
    const handleMemberChange = (index, field, value) => {
      const newMembers = [...members];
      newMembers[index][field] = value;
      setMembers(newMembers);
    };
  
    const addMember = () => setMembers([...members, { name: '', email: '' }]);
  
    const removeMember = (index) => {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    };
  
    const handleFriendSelect = (friend) => {
      const existingIndex = members.findIndex(
        (member) => member.email === friend.email
      );
  
      if (existingIndex !== -1) {
        return; // Friend already selected, do nothing
      }
  
      setMembers([...members, { name: friend.name, email: friend.email || '' }]);
    };
  
    const handleSubmit = async () => {
      try {
        const hasEmptyName = members.some(member => !member.name.trim());
        if (!groupName.trim() || hasEmptyName) {
          alert('Group name and all member names are required.');
          return;
        }
  
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }
  
        const response = await axios.post('http://localhost:3000/groups/create', {
          name: groupName,
          members,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('Group created:', response.data);
        // Redirect to the created group page
        navigate(`/groups/${response.data.group._id}`);
      } catch (error) {
        console.error('Error creating group:', error);
      }
    };
  
    return (
      <div className="min-h-screen bg-auth-back flex flex-col items-center">
        <Navigationbar />
        <div className="mt-24 w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 bg-gray-950 text-white rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6">Create Group</h2>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={handleGroupNameChange}
            className="mb-4 p-3 w-full rounded-md border-2 border-gray-600 bg-black text-white focus:outline-none focus:border-green-500"
          />
          {members.map((member, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 w-full"
            >
              <input
                type="text"
                placeholder="Member Name"
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                className="flex-1 p-3 rounded-md border-2 border-gray-600 bg-black text-white focus:outline-none focus:border-green-500"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={member.email}
                onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                className="flex-1 p-3 rounded-md border-2 border-gray-600 bg-black text-white focus:outline-none focus:border-green-500"
              />
              <button
                onClick={() => removeMember(index)}
                className="mt-2 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addMember}
            className="w-full h-14 mb-4 px-4 py-2 bg-black text-white rounded-md hover:text-green-500 transition duration-300"
          >
            Add Member
          </button>
          <button
            onClick={handleSubmit}
            className="w-full h-14 px-4 py-2 bg-black text-white rounded-md hover:text-green-500 transition duration-300"
          >
            Create Group
          </button>
          <div className="w-full mt-6">
            <h3 className="text-xl font-semibold mb-4">Friends</h3>
            <div className="flex flex-wrap gap-4">
              {friends.map((friend) => (
                <div key={friend._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={() => handleFriendSelect(friend)}
                    className="form-checkbox h-5 w-5 text-green-500"
                  />
                  <label>{friend.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default GroupCreate;
  