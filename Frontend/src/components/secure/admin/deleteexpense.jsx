import axios from 'axios';
import Cookies from 'js-cookie';

const DeleteExpenseForm = ({ groupId, expense, onClose }) => {

  const handleDeleteExpense = async () => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      await axios.delete(`https://split-money-api.vercel.app/groups/${groupId}/expenses/${expense._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Expense deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-md shadow-md w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-white">Are you sure you want delete ?</h2>
        <button onClick={handleDeleteExpense} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700">Yes</button>
      </div>
    </div>
  );
};

export default DeleteExpenseForm;
