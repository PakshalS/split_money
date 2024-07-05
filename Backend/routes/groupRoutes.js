// routes/groupRoutes.js
const express = require('express');
const authenticateJWT = require('../middleware/authMiddleware');
const { createGroup, addMember, removeMember, leaveGroup, editGroup , addFriendstoGroup} = require('../Controller/group');

const router = express.Router();

router.post('/create', authenticateJWT, createGroup);
router.post('/add-member', authenticateJWT, addMember);
router.delete('/remove-member', authenticateJWT, removeMember);
router.post('/leave', authenticateJWT, leaveGroup);
router.put('/edit', authenticateJWT, editGroup);
router.post('/add-friend', authenticateJWT,addFriendstoGroup);


module.exports = router;