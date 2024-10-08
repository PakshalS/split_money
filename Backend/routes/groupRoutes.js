const express = require('express');
const authenticateJWT = require('../middleware/authMiddleware');
const { createGroup,addMember, removeMember, leaveGroup, editGroup , addFriendstoGroup,getUserGroups ,getGroupDetails, transferAdminRights, addExpense, settleUp, deleteGroup, editExpense, deleteExpense} = require('../Controller/group');

const router = express.Router();
router.post('/create', authenticateJWT, createGroup);
router.post('/:groupId/add-member', authenticateJWT, addMember);
router.delete('/:groupId/:memberName/remove-member', authenticateJWT, removeMember);
router.delete('/:groupId/leave', authenticateJWT, leaveGroup);
router.put('/:groupId/edit', authenticateJWT, editGroup);
router.post('/add-friend', authenticateJWT,addFriendstoGroup);
router.get('/user-groups',authenticateJWT,getUserGroups);  
router.get('/:groupId',authenticateJWT,getGroupDetails);
router.post('/:groupId/add-expense',authenticateJWT,addExpense);
router.delete('/:groupId',authenticateJWT,deleteGroup);
router.post('/:groupId/settleup',authenticateJWT,settleUp);
router.put('/:groupId/transfer-admin', authenticateJWT,transferAdminRights);
router.put('/:groupId/expenses/:expenseId', authenticateJWT, editExpense);
router.delete('/:groupId/expenses/:expenseId', authenticateJWT, deleteExpense);

module.exports = router;
