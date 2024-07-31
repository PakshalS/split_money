const express = require('express');
const Router = express.Router();
const {sendFriendRequest,respondFriendRequest ,getFriendsofUser, getFriendRequests, removeFriend} = require('../Controller/friendRequestcontroller');
const authenticateJWT = require('../middleware/authMiddleware');

Router.post('/send',authenticateJWT,sendFriendRequest);
Router.post('/respond',authenticateJWT,respondFriendRequest);
Router.get('/get-friends',authenticateJWT,getFriendsofUser);
Router.get('/get-requests',authenticateJWT,getFriendRequests);
Router.delete('/:friendId/remove',authenticateJWT,removeFriend);


module.exports = Router;
