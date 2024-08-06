const express = require('express');
const { register, login } = require('../Controller/authcontroller');
// const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// router.post('/request-password-reset', requestPasswordReset);
// router.put('/change-password', authenticateJWT, changePassword);

module.exports = router;
