
const User = require('../models/User');

// const sendFriendRequest = async (req, res) => {
//   try {
//     const requesterId = req.user.userId;
//     const { email } = req.body;

//     const recipient = await User.findOne({ email });
//     if (!recipient) {
//       return res.status(404).json({ error: 'User not Found' });
//     }

//     const existingRequest = recipient.requests.find(
//       request => request.requester.toString() === requesterId && request.recipient.toString() === recipient._id.toString()
//     );
//     if (existingRequest) {
//       return res.status(400).json({ error: 'Request Already Sent' });
//     }

//     const request = {
//       requester: requesterId,
//       recipient: recipient._id,
//       status: 'pending',
//     };

//     recipient.requests.push(request);
//     await recipient.save();

//     const requester = await User.findById(requesterId);
//     requester.requests.push(request);
//     await requester.save();

//     res.status(201).json({ message: "Friend Request Sent Successfully" });
//   } catch (error) {
//     console.error('Error Sending Friendrequest:', error);
//     res.status(500).json({ error: "Failed to send friend request" });
//   }
// };

const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user.userId;
    const { email } = req.body;

    // Ensure the requester is not sending a request to themselves
    const requester = await User.findById(requesterId);
    if (requester.email === email) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if the recipient exists
    const recipient = await User.findOne({ email });
    if (!recipient) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure the requester and recipient are not already friends
    if (requester.friends.includes(recipient._id)) {
      return res.status(400).json({ error: 'User is already your friend' });
    }

    // Ensure there isn't an existing pending friend request
    const existingRequest = recipient.requests.find(
      request => request.requester.toString() === requesterId && request.recipient.toString() === recipient._id.toString()
    );
    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    const request = {
      requester: requesterId,
      recipient: recipient._id,
      status: 'pending',
    };

    // Add the request to both the requester and recipient
    recipient.requests.push(request);
    requester.requests.push(request);

    await recipient.save();
    await requester.save();

    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: "Failed to send friend request" });
  }
};

const respondFriendRequest = async (req, res) => {
  try {
    const { requesterId, action } = req.body;
    const recipientId = req.user.userId;

    const recipient = await User.findById(recipientId);
    const friendRequest = recipient.requests.find(
      request => request.requester.toString() === requesterId && request.recipient.toString() === recipientId
    );

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend Request Not found" });
    }

    friendRequest.status = action;
    await recipient.save();

    const requester = await User.findById(requesterId);
    const sentRequest = requester.requests.find(
      request => request.requester.toString() === requesterId && request.recipient.toString() === recipientId
    );

    if (sentRequest) {
      sentRequest.status = action;
      await requester.save();
    }

    if (action === 'accepted') {
      recipient.friends.push(requesterId);
      requester.friends.push(recipientId);
      await recipient.save();
      await requester.save();
    }

    res.status(200).json({ message: `Friend request ${action}` });
  } catch (error) {
    console.error('Error responding to friend request:', error);
    res.status(500).json({ error: 'Failed to respond to friend request' });
  }
};

const getFriendsofUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('friends', 'name email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error('Error fetching user friends:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .populate('requests.requester', 'name email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pendingRequests = user.requests.filter(request => 
      request.recipient.toString() === userId && request.status === 'pending'
    );

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ error: 'Failed to fetch friend requests' });
  }
};

module.exports = { getFriendRequests };


module.exports = {getFriendRequests,sendFriendRequest , respondFriendRequest,getFriendsofUser};