const User = require('../models/User');
const FriendRequest = require('../models/friendRequest');

const sendFriendRequest = async (req, res)=>{
    try {
        const requesterId = req.user.userId;
        const {email} =req.body;

        const recipient = await User.findOne({email});
        if(!recipient)
        {
            return res.status(404).json({error:'User not Found'})
        }

        const existingRequest = await FriendRequest.findOne({requester:requesterId , recipient: recipient._id})
        if(existingRequest)
        {
            return res.status(400).json({error:'Request Already Sent'});
        }

        const friendrequest = new FriendRequest ({requester:requesterId , recipient: recipient._id})
        await friendrequest.save();
        res.status(201).json({message:"Friend Request Sent Successfully"})
    } catch (error) {
        console.error('Error Sending Friendrequest:',error);
        res.status(500).json({error:"Failed to send friend request"})
    }
}
const respondFriendRequest = async (req, res)=>{
    try {
        const {requestId, action}=req.body;
        const userId = req.user.userId;

        const friendrequest = await FriendRequest.findById(requestId);
        if(!friendrequest || friendrequest.recipient.toString()!== userId)
        {
            res.status(404).json({error:"Friend Request Not found"});       
        }
        friendrequest.status = action;
        await friendrequest.save();

        if(action== 'accepted'){
            const requester = await User.findById(friendrequest.requester);
            requester.friends.push(userId);
            await requester.save();

            const recipient = await User.findById(friendrequest.recipient);
            recipient.friends.push(friendrequest.requester);
            await recipient.save();
        }
        res.status(200).json({ message: `Friend request ${action}` });
        
    } catch (error) {
        console.error('Error responding to friend request:', error);
    res.status(500).json({ error: 'Failed to respond to friend request' });
    }
}

module.exports = {sendFriendRequest , respondFriendRequest};