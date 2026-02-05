import * as groupsAPI from '../../api/groups';

/**
 * Groups Slice - Manages all group-related state and actions
 */
export const createGroupsSlice = (set, get) => ({
  // ========== STATE ==========
  groups: [],
  groupDetails: {}, // Map of groupId -> detailed group data
  isLoadingGroups: false,
  isLoadingGroupDetails: {}, // Map of groupId -> loading state
  groupErrors: {},

  // ========== ACTIONS ==========

  /**
   * Fetch all groups for the current user
   */
  fetchGroups: async () => {
    set({ isLoadingGroups: true, groupErrors: {} });
    try {
      const groups = await groupsAPI.fetchUserGroups();
      set({ groups, isLoadingGroups: false });
      return groups;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to fetch groups';
      set({ 
        isLoadingGroups: false,
        groupErrors: { ...get().groupErrors, fetchGroups: errorMsg }
      });
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  /**
   * Fetch detailed information for a specific group
   */
  fetchGroupDetails: async (groupId) => {
    set(state => ({
      isLoadingGroupDetails: { ...state.isLoadingGroupDetails, [groupId]: true },
      groupErrors: { ...state.groupErrors, [groupId]: null }
    }));
    
    try {
      const details = await groupsAPI.fetchGroupDetails(groupId);
      set(state => ({
        groupDetails: { ...state.groupDetails, [groupId]: details },
        isLoadingGroupDetails: { ...state.isLoadingGroupDetails, [groupId]: false }
      }));
      return details;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to fetch group details';
      set(state => ({
        isLoadingGroupDetails: { ...state.isLoadingGroupDetails, [groupId]: false },
        groupErrors: { ...state.groupErrors, [groupId]: errorMsg }
      }));
      console.error('Error fetching group details:', error);
      throw error;
    }
  },

  /**
   * Create a new group with optimistic update
   */
  createGroup: async (groupData) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticGroup = {
      _id: tempId,
      name: groupData.name,
      members: groupData.members,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };

    // Optimistic update
    set(state => ({
      groups: [optimisticGroup, ...state.groups]
    }));

    try {
      const response = await groupsAPI.createGroup(groupData);
      const newGroup = response.group;

      // Replace optimistic group with real data
      set(state => ({
        groups: state.groups.map(g => g._id === tempId ? newGroup : g)
      }));

      return newGroup;
    } catch (error) {
      // Rollback optimistic update
      set(state => ({
        groups: state.groups.filter(g => g._id !== tempId)
      }));
      const errorMsg = error.response?.data?.error || 'Failed to create group';
      console.error('Error creating group:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Update group information
   */
  updateGroup: async (groupId, updates) => {
    // Store original state for rollback
    const originalGroups = get().groups;
    const originalDetails = get().groupDetails[groupId];

    // Optimistic update
    set(state => ({
      groups: state.groups.map(g => 
        g._id === groupId ? { ...g, ...updates } : g
      ),
      groupDetails: {
        ...state.groupDetails,
        [groupId]: originalDetails ? { 
          ...originalDetails,
          group: { ...originalDetails.group, ...updates }
        } : originalDetails
      }
    }));

    try {
      const response = await groupsAPI.updateGroup(groupId, updates);
      
      // Update with server response
      await get().fetchGroupDetails(groupId);
      await get().fetchGroups();
      
      return response;
    } catch (error) {
      // Rollback on error
      set({
        groups: originalGroups,
        groupDetails: { ...get().groupDetails, [groupId]: originalDetails }
      });
      const errorMsg = error.response?.data?.error || 'Failed to update group';
      console.error('Error updating group:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Delete a group
   */
  deleteGroup: async (groupId) => {
    const originalGroups = get().groups;
    
    // Optimistic update
    set(state => ({
      groups: state.groups.filter(g => g._id !== groupId),
      groupDetails: { ...state.groupDetails, [groupId]: null }
    }));

    try {
      await groupsAPI.deleteGroup(groupId);
      return true;
    } catch (error) {
      // Rollback on error
      set({ groups: originalGroups });
      const errorMsg = error.response?.data?.error || 'Failed to delete group';
      console.error('Error deleting group:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Leave a group
   */
  leaveGroup: async (groupId) => {
    const originalGroups = get().groups;
    
    // Optimistic update
    set(state => ({
      groups: state.groups.filter(g => g._id !== groupId),
      groupDetails: { ...state.groupDetails, [groupId]: null }
    }));

    try {
      await groupsAPI.leaveGroup(groupId);
      return true;
    } catch (error) {
      // Rollback on error
      set({ groups: originalGroups });
      const errorMsg = error.response?.data?.error || 'Failed to leave group';
      console.error('Error leaving group:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Add an expense to a group
   */
  addExpense: async (groupId, expenseData) => {
    try {
      const response = await groupsAPI.addExpense(groupId, expenseData);
      
      // Refresh group details to get updated expenses, balances, and summary
      await get().fetchGroupDetails(groupId);
      
      // Also update the groups list to reflect any changes
      await get().fetchGroups();
      
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to add expense';
      console.error('Error adding expense:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Update an expense
   */
  updateExpense: async (groupId, expenseId, expenseData) => {
    try {
      const response = await groupsAPI.updateExpense(groupId, expenseId, expenseData);
      
      // Refresh group details
      await get().fetchGroupDetails(groupId);
      await get().fetchGroups();
      
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to update expense';
      console.error('Error updating expense:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Delete an expense
   */
  deleteExpense: async (groupId, expenseId) => {
    try {
      const response = await groupsAPI.deleteExpense(groupId, expenseId);
      
      // Refresh group details
      await get().fetchGroupDetails(groupId);
      await get().fetchGroups();
      
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to delete expense';
      console.error('Error deleting expense:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Add members to a group
   */
  addMembers: async (groupId, members) => {
    try {
      const response = await groupsAPI.addMembers(groupId, members);
      
      // Refresh group details
      await get().fetchGroupDetails(groupId);
      await get().fetchGroups();
      
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to add members';
      console.error('Error adding members:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Remove a member from a group
   */
  removeMember: async (groupId, memberName) => {
    try {
      const response = await groupsAPI.removeMember(groupId, memberName);
      
      // Refresh group details
      await get().fetchGroupDetails(groupId);
      await get().fetchGroups();
      
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to remove member';
      console.error('Error removing member:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Change group admin
   */
  changeAdmin: async (groupId, newAdminId) => {
    try {
      const response = await groupsAPI.changeAdmin(groupId, newAdminId);
      
      // Refresh group details
      await get().fetchGroupDetails(groupId);
      await get().fetchGroups();
      
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to change admin';
      console.error('Error changing admin:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Add a settlement/payment
   */
  addSettlement: async (groupId, settlementData) => {
    try {
      const response = await groupsAPI.addSettlement(groupId, settlementData);
      
      // Refresh group details to update balances
      await get().fetchGroupDetails(groupId);
      await get().fetchGroups();
      
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to add settlement';
      console.error('Error adding settlement:', error);
      throw new Error(errorMsg);
    }
  },

  /**
   * Clear errors for a specific group or all groups
   */
  clearGroupErrors: (groupId = null) => {
    if (groupId) {
      set(state => ({
        groupErrors: { ...state.groupErrors, [groupId]: null }
      }));
    } else {
      set({ groupErrors: {} });
    }
  },

  /**
   * Clear all group data (useful for logout)
   */
  clearGroupsData: () => {
    set({
      groups: [],
      groupDetails: {},
      isLoadingGroups: false,
      isLoadingGroupDetails: {},
      groupErrors: {}
    });
  },

  /**
   * Handle real-time socket update for a group
   * Refreshes the group details when changes occur
   */
  handleSocketGroupUpdate: async (groupId) => {
    console.log('Socket update received for group:', groupId);
    try {
      // Silently refresh group details in background
      const details = await groupsAPI.fetchGroupDetails(groupId);
      set(state => ({
        groupDetails: { ...state.groupDetails, [groupId]: details }
      }));
      
      // Also refresh groups list to update names if changed
      const groups = await groupsAPI.fetchUserGroups();
      set({ groups });
    } catch (error) {
      console.error('Error handling socket update:', error);
      // Don't throw error for background updates
    }
  }
});

