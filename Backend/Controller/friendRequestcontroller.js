
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

// const respondFriendRequest = async (req, res) => {
//   try {
//     const { requesterId, action } = req.body;
//     const recipientId = req.user.userId;

//     const recipient = await User.findById(recipientId);
//     const friendRequest = recipient.requests.find(
//       request => request.requester.toString() === requesterId && request.recipient.toString() === recipientId
//     );

//     if (!friendRequest) {
//       return res.status(404).json({ error: "Friend Request Not found" });
//     }

//     friendRequest.status = action;
//     await recipient.save();

//     const requester = await User.findById(requesterId);
//     const sentRequest = requester.requests.find(
//       request => request.requester.toString() === requesterId && request.recipient.toString() === recipientId
//     );

//     if (sentRequest) {
//       sentRequest.status = action;
//       await requester.save();
//     }

//     if (action === 'accepted') {
//       recipient.friends.push(requesterId);
//       requester.friends.push(recipientId);
//       await recipient.save();
//       await requester.save();
//     }

//     res.status(200).json({ message: `Friend request ${action}` });
//   } catch (error) {
//     console.error('Error responding to friend request:', error);
//     res.status(500).json({ error: 'Failed to respond to friend request' });
//   }
// };
const respondFriendRequest = async (req, res) => {
  try {
    const { requesterId, action } = req.body;
    const recipientId = req.user.userId;

    // Find the recipient and requester users
    const recipient = await User.findById(recipientId);
    const requester = await User.findById(requesterId);

    if (!recipient || !requester) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the friend request in the recipient's requests
    const friendRequestIndex = recipient.requests.findIndex(
      request => request.requester.toString() === requesterId && request.recipient.toString() === recipientId
    );

    if (friendRequestIndex === -1) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    // Update the status of the request
    recipient.requests[friendRequestIndex].status = action;
    await recipient.save();

    // Find and update the corresponding request in the requester's requests
    const sentRequestIndex = requester.requests.findIndex(
      request => request.requester.toString() === requesterId && request.recipient.toString() === recipientId
    );

    if (sentRequestIndex !== -1) {
      requester.requests[sentRequestIndex].status = action;
      await requester.save();
    }

    // If the action is 'accepted', add users to each other's friends lists
    if (action === 'accepted') {
      recipient.friends.push(requesterId);
      requester.friends.push(recipientId);
      await recipient.save();
      await requester.save();
    }

    // Remove the request from both users' requests arrays
    recipient.requests = recipient.requests.filter(
      request => request.requester.toString() !== requesterId || request.recipient.toString() !== recipientId
    );

    requester.requests = requester.requests.filter(
      request => request.requester.toString() !== requesterId || request.recipient.toString() !== recipientId
    );

    await recipient.save();
    await requester.save();

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

const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params; // Get friendId from URL parameters
    const userId = req.user.userId;  // Authenticated user's ID

    // Find the current user and the friend to be removed
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the friend from the user's friends list
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    // Remove the user from the friend's friends list
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: "Failed to remove friend" });
  }
};

module.exports = {getFriendRequests,sendFriendRequest , respondFriendRequest,getFriendsofUser, removeFriend};