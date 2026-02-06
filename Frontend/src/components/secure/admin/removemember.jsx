import React, { useState } from 'react';
import useStore from '../../../store/useStore';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const RemoveMemberForm = ({ groupId, member, onClose, onSuccess, isDark }) => {
  const [loading, setLoading] = useState(false);
  
  // Get store action
  const { removeMember } = useStore();

  const handleRemoveMember = async () => {
    setLoading(true);

    try {
      await removeMember(groupId, member.name);
      alert('Member removed successfully!');
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert(error.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={true}
      onClose={onClose}
      onConfirm={handleRemoveMember}
      title="Remove Member"
      message={`Are you sure you want to remove ${member.name}? This action cannot be undone.`}
      confirmText="Remove"
      cancelText="Cancel"
      type="warning"
      loading={loading}
    />
  );
};

export default RemoveMemberForm;