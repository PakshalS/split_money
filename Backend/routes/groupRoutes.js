// routes/groupRoutes.js
const express = require('express');
const authenticateJWT = require('../middleware/authMiddleware');
const { createGroup,addMember, removeMember, leaveGroup, editGroup , addFriendstoGroup,getUserGroups ,getGroupDetails, transferAdminRights} = require('../Controller/group');

const router = express.Router();

router.post('/create', authenticateJWT, createGroup);
router.post('/add-member', authenticateJWT, addMember);
router.delete('/remove-member', authenticateJWT, removeMember);
router.post('/leave', authenticateJWT, leaveGroup);
router.put('/edit', authenticateJWT, editGroup);
router.post('/add-friend', authenticateJWT,addFriendstoGroup);
router.get('/user-groups',authenticateJWT,getUserGroups);  
router.get('/:groupId',authenticateJWT,getGroupDetails);
router.post('/transfer-admin-rights', authenticateJWT,transferAdminRights);




module.exports = router;