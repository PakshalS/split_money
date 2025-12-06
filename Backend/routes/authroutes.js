const express = require('express');
const { register, login ,requestPasswordReset,changePassword} = require('../Controller/authcontroller');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset);
router.post('/change-password', authenticateJWT, changePassword);

module.exports = router;
