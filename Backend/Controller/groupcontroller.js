// controllers/groupController.js
const Group = require('../models/Group');
const User = require('../models/User');

const createGroup = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const creator = req.user._id;

    // Validate that all members are friends of the creator
    const creatorUser = await User.findById(creator).populate('friends');
    const friendIds = creatorUser.friends.map(friend => friend._id.toString());

    const invalidMembers = memberIds.filter(id => !friendIds.includes(id));
    if (invalidMembers.length) {
      return res.status(400).json({ error: 'Some members are not in your friends list' });
    }

    const group = new Group({ name, creator, members: [creator, ...memberIds] });
    await group.save();

    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

const addMember = async (req, res) => {
    try {
      const { groupId, memberId } = req.body;
      const userId = req.user._id;
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      if (group.creator.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Only the group creator can add members' });
      }
  
      const user = await User.findById(memberId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (group.members.includes(memberId)) {
        return res.status(400).json({ error: 'User is already a member of the group' });
      }
  
      group.members.push(memberId);
      await group.save();
  
      res.status(200).json({ message: 'Member added successfully', group });
    } catch (error) {
      console.error('Error adding member:', error);
      res.status(500).json({ error: 'Failed to add member' });
    }
  };
  
  const removeMember = async (req, res) => {
    try {
      const { groupId, memberId } = req.body;
      const userId = req.user._id;
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      if (group.creator.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Only the group creator can remove members' });
      }
  
      group.members = group.members.filter(member => member.toString() !== memberId.toString());
      await group.save();
  
      res.status(200).json({ message: 'Member removed successfully', group });
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(500).json({ error: 'Failed to remove member' });
    }
  };
  
  module.exports = { createGroup, addMember, removeMember };
  