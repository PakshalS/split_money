// EditGroupForm.js
import React, { useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const GroupEditForm = ({ groupId, onClose }) => {
    const [name, setName] = useState('');

  const handleEdit = async () => {

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      await axios.put(`http://localhost:3000/groups/${groupId}/edit`, {
        groupId,
        name,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Edited successfully!');
      onClose();
    } catch (error) {
      console.error('Error editing group', error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      if(confirm("Are you sure you want to delete ?"))
      {
        await axios.delete(`http://localhost:3000/groups/${groupId}`, {
          groupId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        alert('Edited successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Error editing group', error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-950 p-6 rounded-md shadow-md w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-white">Edit Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white"
        />
        <div className='space-x-2'>
        <button onClick={handleEdit} className="bg-gray-900 text-white px-4 py-2 rounded hover:text-green-500">Done</button>      
        <button onClick={handleDelete} className="bg-gray-900 text-white px-4 py-2 rounded hover:text-green-500">Delete group</button>
        </div>
      </div>
    </div>
  );
};

export default GroupEditForm;
