import apiClient from './client';

/**
 * Groups API - All group-related API calls
 */

// ========== GROUP CRUD ==========

/**
 * Fetch all groups for the current user
 */
export const fetchUserGroups = async () => {
  const response = await apiClient.get('/groups/user-groups');
  return response.data;
};

/**
 * Fetch detailed information for a specific group
 * @param {string} groupId - The group ID
 */
export const fetchGroupDetails = async (groupId) => {
  const response = await apiClient.get(`/groups/${groupId}`);
  return response.data;
};

/**
 * Create a new group
 * @param {object} groupData - { name, members: [{ name, email, isGuest }] }
 */
export const createGroup = async (groupData) => {
  const response = await apiClient.post('/groups/create', groupData);
  return response.data;
};

/**
 * Update group settings
 * @param {string} groupId - The group ID
 * @param {object} updates - { name, strictJoin }
 */
export const updateGroup = async (groupId, updates) => {
  const response = await apiClient.put(`/groups/${groupId}/edit`, { 
    name: updates.name,
    ...updates 
  });
  return response.data;
};

/**
 * Update group strict join setting
 * @param {string} groupId - The group ID
 * @param {boolean} strictJoin - Enable/disable strict join
 */
export const updateStrictJoin = async (groupId, strictJoin) => {
  const response = await apiClient.put(`/groups/${groupId}/edit`, { strictJoin });
  return response.data;
};

/**
 * Approve a join request
 * @param {string} groupId - The group ID
 * @param {string} requesterId - The requester's user ID
 */
export const approveJoinRequest = async (groupId, requesterId) => {
  const response = await apiClient.put(`/groups/${groupId}/join-requests/${requesterId}/approve`, {});
  return response.data;
};

/**
 * Reject a join request
 * @param {string} groupId - The group ID
 * @param {string} requesterId - The requester's user ID
 */
export const rejectJoinRequest = async (groupId, requesterId) => {
  const response = await apiClient.put(`/groups/${groupId}/join-requests/${requesterId}/reject`, {});
  return response.data;
};

/**
 * Delete a group (admin only)
 * @param {string} groupId - The group ID
 */
export const deleteGroup = async (groupId) => {
  const response = await apiClient.delete(`/groups/${groupId}`);
  return response.data;
};

/**
 * Leave a group (non-admin members)
 * @param {string} groupId - The group ID
 */
export const leaveGroup = async (groupId) => {
  const response = await apiClient.delete(`/groups/${groupId}/leave`);
  return response.data;
};

// ========== EXPENSE MANAGEMENT ==========

/**
 * Add a new expense to a group
 * @param {string} groupId - The group ID
 * @param {object} expenseData - { name, amount, paidBy, splitAmongst, date }
 */
export const addExpense = async (groupId, expenseData) => {
  const response = await apiClient.post(`/groups/${groupId}/add-expense`, expenseData);
  return response.data;
};

/**
 * Update an existing expense
 * @param {string} groupId - The group ID
 * @param {string} expenseId - The expense ID
 * @param {object} expenseData - Updated expense data
 */
export const updateExpense = async (groupId, expenseId, expenseData) => {
  const response = await apiClient.put(`/groups/${groupId}/expenses/${expenseId}`, expenseData);
  return response.data;
};

/**
 * Delete an expense
 * @param {string} groupId - The group ID
 * @param {string} expenseId - The expense ID
 */
export const deleteExpense = async (groupId, expenseId) => {
  const response = await apiClient.delete(`/groups/${groupId}/expenses/${expenseId}`);
  return response.data;
};

// ========== MEMBER MANAGEMENT ==========

/**
 * Add members to a group
 * @param {string} groupId - The group ID
 * @param {array} members - [{ name, email, isGuest }]
 */
export const addMembers = async (groupId, members) => {
  const response = await apiClient.post(`/groups/${groupId}/add-member`, { members });
  return response.data;
};

/**
 * Remove a member from a group
 * @param {string} groupId - The group ID
 * @param {string} memberName - The member's name
 */
export const removeMember = async (groupId, memberName) => {
  const response = await apiClient.delete(`/groups/${groupId}/${memberName}/remove-member`);
  return response.data;
};

/**
 * Change group admin (transfer admin - old admin becomes regular member)
 * @param {string} groupId - The group ID
 * @param {string} newAdminName - The new admin's name (not ID)
 * @deprecated Use addAdmin/removeAdmin for multiple admin support
 */
export const changeAdmin = async (groupId, newAdminName) => {
  const response = await apiClient.put(`/groups/${groupId}/transfer-admin`, { newAdminName });
  return response.data;
};

/**
 * Add a member as admin
 * @param {string} groupId - The group ID
 * @param {string} memberName - The member's name
 */
export const addAdmin = async (groupId, memberName) => {
  const response = await apiClient.put(`/groups/${groupId}/${memberName}/add-admin`, {});
  return response.data;
};

/**
 * Remove a member from admin
 * @param {string} groupId - The group ID
 * @param {string} memberName - The member's name
 */
export const removeAdmin = async (groupId, memberName) => {
  const response = await apiClient.put(`/groups/${groupId}/${memberName}/remove-admin`, {});
  return response.data;
};

/**
 * Get group invite link
 * @param {string} groupId - The group ID
 */
export const getGroupInviteLink = async (groupId) => {
  const response = await apiClient.get(`/groups/${groupId}/invite-link`);
  return response.data;
};

/**
 * Join a group using join code
 * @param {string} joinCode - The join code for the group
 */
export const joinGroup = async (joinCode) => {
  const response = await apiClient.post(`/groups/join/${joinCode}`, {});
  return response.data;
};

// ========== SETTLEMENTS =========="

/**
 * Record a settlement/payment between members
 * @param {string} groupId - The group ID
 * @param {object} settlementData - { payer, receiver, amount, date }
 */
export const addSettlement = async (groupId, settlementData) => {
  const response = await apiClient.post(`/groups/${groupId}/settleup`, settlementData);
  return response.data;
};

export default {
  fetchUserGroups,
  fetchGroupDetails,
  createGroup,
  updateGroup,
  deleteGroup,
  leaveGroup,
  addExpense,
  updateExpense,
  deleteExpense,
  addMembers,
  removeMember,
  changeAdmin,
  addAdmin,
  removeAdmin,
  getGroupInviteLink,
  joinGroup,
  addSettlement,
};
