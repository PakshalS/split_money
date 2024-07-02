// routes/groupRoutes.js
const express = require('express');
const { createGroup, addMember, removeMember } = require('../Controller/groupcontroller');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authenticateJWT, createGroup);
router.post('/add-member', authenticateJWT, addMember);
router.post('/remove-member', authenticateJWT, removeMember);

module.exports = router;
