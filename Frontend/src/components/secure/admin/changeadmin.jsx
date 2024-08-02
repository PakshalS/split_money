// EditGroupForm.js
import React, { useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ChangeAdminForm = ({ groupId, onClose }) => {
    const [newAdminName, setnewAdminName] = useState('');


  const handleEdit = async () => {

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      await axios.post(`http://localhost:3000/groups/${groupId}/transfer-admin`, {
        groupId,
        newAdminName,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Transfer admin rights successfully!');
      onClose();
    } catch (error) {
      console.error('Error changing admin', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-950 p-6 rounded-md shadow-md w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-white">Change admin</h2>
        <input
          type="text"
          placeholder="New Admin Name"
          value={newAdminName}
          onChange={(e) => setnewAdminName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white"
        />
        <button onClick={handleEdit} className="bg-gray-900 text-white px-4 py-2 rounded hover:text-green-500">Done</button>      
      </div>
    </div>
  );
};

export default ChangeAdminForm;
