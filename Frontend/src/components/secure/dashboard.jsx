import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import GroupSidebar from './groupsidebar';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const navigate = useNavigate();
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

    // Automatically open or close the sidebar based on screen size
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024); // lg breakpoint in Tailwind CSS is 1024px
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);


    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlegroupOnClick =()=> {
     navigate('/create-group');
  };
  const handlefriendsOnClick =()=> {
    navigate('/friends');
 };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-auth-back">
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`transition-transform duration-300 transform ${
            isSidebarOpen ? 'w-64' : 'w-12'
          } bg-black text-white relative`}
          style={{ transitionProperty: 'width, transform' }}
        >
          <div className="flex items-center justify-between px-4 mt-16 lg:mt-20 py-2 bg-black">
            <h2 className={`text-lg font-semibold ${isSidebarOpen ? 'block' : 'hidden'}`}>My Groups</h2>
            <div
              className="cursor-pointer transition-transform duration-300 transform hover:scale-110"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
            </div>
          </div>
          {isSidebarOpen && <GroupSidebar groups={userGroups} />}
        </div>
        <div className="flex-1 p-8 mt-28 overflow-auto">
          <div className="flex flex-col gap-6 items-center lg:flex-row">
            <div className="sm:h-64 sm:w-96 sm:rounded-3xl sm:text-xl lg:h-96 lg:w-1/2 flex items-center justify-center bg-black rounded-full lg:rounded-3xl lg:text-3xl">
              <button onClick={handlegroupOnClick}
                className="h-max w-max p-4 overflow-auto bg-black hover:text-green-500 text-white font-semibold rounded-xl transition-transform duration-300 transform hover:scale-110"
              >
                CREATE A NEW GROUP
              </button>
            </div>
            <div className="sm:h-64 sm:w-96 sm:rounded-3xl sm:text-xl lg:h-96 lg:w-1/2 flex items-center justify-center bg-black rounded-full lg:rounded-3xl lg:text-3xl">
              <button  onClick={handlefriendsOnClick}
                className="h-max w-max p-4 bg-black hover:text-green-500 text-white font-semibold rounded-xl transition-transform duration-300 transform hover:scale-110"
              >
                ADD A NEW FRIEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
