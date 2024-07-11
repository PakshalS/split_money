const express = require('express');
const Router = express.Router();
const {sendFriendRequest,respondFriendRequest} = require('../Controller/friendRequestcontroller');
const authenticateJWT = require('../middleware/authMiddleware');

Router.post('/send',authenticateJWT,sendFriendRequest);
Router.post('/respond',authenticateJWT,respondFriendRequest);

module.exports = Router;
