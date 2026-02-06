const express = require('express');
const authenticateJWT = require('../middleware/authMiddleware');
const { createGroup, addMember, removeMember, leaveGroup, editGroup, addFriendstoGroup, getUserGroups, getGroupDetails, transferAdminRights, addExpense, settleUp, deleteGroup, editExpense, deleteExpense, addAdmin, removeAdmin, getGroupInviteLink, joinGroup, approveJoinRequest, rejectJoinRequest } = require('../Controller/group');

const router = express.Router();

// Specific routes first (more specific patterns before general ones)
router.post('/create', authenticateJWT, createGroup);
router.post('/join/:joinCode', authenticateJWT, joinGroup);
router.get('/user-groups', authenticateJWT, getUserGroups);  

// Group-specific routes (with :groupId)
router.post('/:groupId/add-member', authenticateJWT, addMember);
router.post('/:groupId/add-expense', authenticateJWT, addExpense);
router.post('/:groupId/settleup', authenticateJWT, settleUp);
router.post('/add-friend', authenticateJWT, addFriendstoGroup);

router.put('/:groupId/edit', authenticateJWT, editGroup);
router.put('/:groupId/transfer-admin', authenticateJWT, transferAdminRights);
router.put('/:groupId/join-requests/:requesterId/approve', authenticateJWT, approveJoinRequest);
router.put('/:groupId/join-requests/:requesterId/reject', authenticateJWT, rejectJoinRequest);
router.put('/:groupId/:memberName/add-admin', authenticateJWT, addAdmin);
router.put('/:groupId/:memberName/remove-admin', authenticateJWT, removeAdmin);
router.put('/:groupId/expenses/:expenseId', authenticateJWT, editExpense);

router.delete('/:groupId', authenticateJWT, deleteGroup);
router.delete('/:groupId/:memberName/remove-member', authenticateJWT, removeMember);
router.delete('/:groupId/leave', authenticateJWT, leaveGroup);
router.delete('/:groupId/expenses/:expenseId', authenticateJWT, deleteExpense);

// Specific GET routes before general :groupId route
router.get('/:groupId/invite-link', authenticateJWT, getGroupInviteLink);
router.get('/:groupId', authenticateJWT, getGroupDetails);

module.exports = router;
