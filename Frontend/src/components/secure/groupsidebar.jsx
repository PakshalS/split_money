import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroupSidebar = ({ groups }) => {
  const navigate = useNavigate();

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <ul className="mt-2 space-y-2 px-2">
      {groups.map((group) => (
        <li
          key={group._id}
          className="p-2 bg-black hover:text-green-500 rounded-md cursor-pointer transition duration-150"
          onClick={() => handleGroupClick(group._id)}
        >
          {group.name}
        </li>
      ))}
    </ul>
  );
};

export default GroupSidebar;
