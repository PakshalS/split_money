// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navigationbar from '../navbar';
import GroupSidebar from './groupsidebar';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Dashboard = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const response = await axios.get('http://localhost:3000/groups/user-groups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserGroups(response.data);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navigationbar />
      <div className="flex flex-1 overflow-hidden">
        <div className={`transition-transform duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} bg-gray-800 text-white relative`}>
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900">
            <h2 className={`text-lg font-semibold ${isSidebarOpen ? 'block' : 'hidden'}`}>My Groups</h2>
            <div
              className="cursor-pointer"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
            </div>
          </div>
          {isSidebarOpen && <GroupSidebar groups={userGroups} />}
        </div>
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex flex-col space-y-4 items-center">
            <button className="w-full max-w-xs py-4 bg-blue-500 text-white font-semibold rounded-md">
              CREATE A NEW GROUP
            </button>
            <button className="w-full max-w-xs py-4 bg-green-500 text-white font-semibold rounded-md">
              ADD A NEW FRIEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
