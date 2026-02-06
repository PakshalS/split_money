import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../../store/useStore';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const DeleteGroupForm = ({ groupId, onClose, setIsDeleted, isDark }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get store actions
  const { deleteGroup } = useStore();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteGroup(groupId);
      setIsDeleted(true);
      onClose();
      navigate('/home');
    } catch (error) {
      console.error('Error deleting group', error);
      alert(error.message || 'Failed to delete group');
      setLoading(false);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={true}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Group"
      message="Are you sure you want to delete this group? All expenses and history will be permanently removed. This action cannot be undone."
      confirmText="Delete Group"
      cancelText="Cancel"
      type="danger"
      loading={loading}
    />
  );
};

export default DeleteGroupForm;