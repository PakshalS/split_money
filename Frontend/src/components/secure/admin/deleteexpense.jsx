import React, { useState } from 'react';
import useStore from '../../../store/useStore';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const DeleteExpenseForm = ({ groupId, expense, onClose, isDark }) => {
  const [loading, setLoading] = useState(false);

  // Get store action
  const { deleteExpense } = useStore();

  const handleDeleteExpense = async () => {
    setLoading(true);

    try {
      await deleteExpense(groupId, expense._id);
      alert('Expense deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert(error.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={true}
      onClose={onClose}
      onConfirm={handleDeleteExpense}
      title="Delete Expense"
      message={`Are you sure you want to delete "${expense.name}" (₹${expense.amount})? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      type="danger"
      loading={loading}
    />
  );
};

export default DeleteExpenseForm;