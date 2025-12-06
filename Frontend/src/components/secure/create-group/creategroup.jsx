import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Navigationbar from '../../navbar';
import GroupForm from './groupform';
import FriendsList from './friendslist';

const GroupCreate = () => {
  const [members, setMembers] = useState([{ name: '', email: '' }]);
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [message1, setMessage1] = useState("");
  const [error1, setError1] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const response = await axios.get('https://split-money-api.vercel.app/friends/get-friends', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data);
        setMessage1(response.data.message);
        setError1("");
      } catch (error) {
        setMessage1("");
        setError1(error.response?.data?.error || 'Error fetching friends');
      }
    };

    fetchFriends();
  }, []);

  const handleFriendSelect = (friend) => {
    const existingIndex = members.findIndex(
      (member) => member.email === friend.email
    );

    if (existingIndex !== -1) {
      // Remove friend if already selected
      const newMembers = members.filter((_, i) => i !== existingIndex);
      setMembers(newMembers);
    } else {
      // Add friend to members
      setMembers([...members, { name: friend.name, email: friend.email || '', isFriend: true }]);
    }
  };

  const handleSubmit = async (groupName) => {
    try {
      const hasEmptyName = members.some(member => !member.name.trim());
      if (!groupName.trim() || hasEmptyName) {
        setError('Group name and all member names are required.');
        setMessage("");
        return;
      }

      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.post('https://split-money-api.vercel.app/groups/create', {
        name: groupName,
        members,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setMessage(response.data.message);
      setError("");
      console.log('Group created:', response.data);
      
      // Redirect to the created group page
      setTimeout(() => {
        navigate(`/groups/${response.data.group._id}`);
      }, 1000);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.error || 'Error creating group');
    }
  };

  const selectedEmails = members.map(m => m.email).filter(Boolean);

  return (
    <div className="min-h-screen pt-24 bg-gray-950">
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-7xl mx-auto">

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Group Form */}
            <div className="animate-slideInLeft">
              <GroupForm
                members={members}
                setMembers={setMembers}
                onSubmit={handleSubmit}
                message={message}
                error={error}
              />
            </div>

            {/* Right Column - Friends List */}
            <div className="animate-slideInRight">
              <FriendsList
                friends={friends}
                onFriendSelect={handleFriendSelect}
                selectedEmails={selectedEmails}
                message1={message1}
                error1={error1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        :global(.animate-fadeIn) {
          animation: fadeIn 0.5s ease-out;
        }

        :global(.animate-slideInLeft) {
          animation: slideInLeft 0.6s ease-out;
        }

        :global(.animate-slideInRight) {
          animation: slideInRight 0.6s ease-out;
        }

        :global(.custom-scrollbar)::-webkit-scrollbar {
          width: 8px;
        }

        :global(.custom-scrollbar)::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }

        :global(.custom-scrollbar)::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
          border-radius: 4px;
        }

        :global(.custom-scrollbar)::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.9);
        }
      `}</style>
    </div>
  );
};

export default GroupCreate;