import axios from 'axios';
import Cookies from 'js-cookie';

const RemoveMemberForm = ({ groupId, member, onClose }) => {

  const handleRemoveMember = async () => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      await axios.delete(`http://localhost:3000/groups/${groupId}/${member.name}/remove-member`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Member removed successfully!');
      onClose();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-gray-950 p-6 rounded-md shadow-md w-96 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-white">&times;</button>
      <h2 className="text-xl font-bold mb-4 text-white">Do you want to remove {member.name} ?</h2>
      <button onClick={handleRemoveMember} className="bg-gray-900 text-white px-4 py-2 rounded hover:text-green-500">Yes</button>
    </div>
  </div>
  );
};

export default RemoveMemberForm;
