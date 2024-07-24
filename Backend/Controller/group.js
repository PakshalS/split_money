const Group = require("../models/Group");
const User = require("../models/User");

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const adminId = req.user.userId;

    // Get admin details
    const admin = await User.findById(adminId);

    // Process members array
    const groupMembers = await Promise.all(
      members.map(async (member) => {
        if (member.email) {
          const user = await User.findOne({ email: member.email });
          if (user) {
            return { user: user._id, name: user.name, email: user.email };
          }
        }
        return { name: member.name, email: member.email };
      })
    );

    // Add admin as the first member
    groupMembers.unshift({
      user: admin._id,
      name: admin.name,
      email: admin.email,
    });

    const group = new Group({
      name,
      admin: adminId,
      members: groupMembers,
    });

    await group.save();
   

    // **Update each member's groups array**
    for (const member of groupMembers) {
      if (member.user) {
        const user = await User.findById(member.user);
        user.groups.push(group._id);
        await user.save();
      }
    }
    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
};

const addMember = async (req, res) => {
  try {
    const { groupId, member } = req.body;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Only the group admin can add members" });
    }

    const newMember = member.email
      ? await User.findOne({ email: member.email })
      : null;

    group.members.push(
      newMember
        ? { user: newMember._id, name: newMember.name, email: newMember.email }
        : { name: member.name, email: member.email }
    );
    // **Update the new member's groups array**
    await group.save();
    if (newMember) {
      newMember.groups.push(group._id);
      await newMember.save();
    }

    res.status(200).json({ message: "Member added successfully", group });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ error: "Failed to add member" });
  }
};

const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Only the group admin can remove members" });
    }

    group.members = group.members.filter(
      (member) => member._id.toString() !== memberId
    );
    await group.save();
    // **Update the member's groups array**
    const member = await User.findById(memberId);
    if (member) {
      member.groups = member.groups.filter(
        (group) => group.toString() !== groupId
      );
      await member.save();
    }

    res.status(200).json({ message: "Member removed successfully", group });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // If the admin is leaving
    if (group.admin.toString() === userId) {
      // Transfer admin rights to the next member
      const nextAdmin = group.members.find(
        (member) => member.user && member.user.toString() !== userId
      );
      if (!nextAdmin) {
        return res
          .status(400)
          .json({
            error: "Cannot leave the group without transferring admin rights",
          });
      }
      group.admin = nextAdmin.user;
    }

    // Remove the member from the group
    group.members = group.members.filter((member) =>
      member.user ? member.user.toString() !== userId : true
    );
    await group.save();
    // **Update the user's groups array**
    const user = await User.findById(userId);
    user.groups = user.groups.filter((group) => group.toString() !== groupId);
    await user.save();

    res.status(200).json({ message: "Left group successfully", group });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ error: "Failed to leave group" });
  }
};

const editGroup = async (req, res) => {
  try {
    const { groupId, name } = req.body;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Only the group admin can edit group details" });
    }

    group.name = name;
    await group.save();

    res
      .status(200)
      .json({ message: "Group details updated successfully", group });
  } catch (error) {
    console.error("Error editing group:", error);
    res.status(500).json({ error: "Failed to edit group" });
  }
};

const addFriendstoGroup = async (req, res) => {
  try {
    const { groupId, friendId } = req.body;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Only the group admin can add members" });
    }
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }

    const isAlreadyMember = group.members.some(
      (member) => member.user && member.user.toString() == friendId
    );
    if (isAlreadyMember) {
      res.status(404).json({ error: "Friend is already a member of group" });
    }

    group.members.push({
      user: friend._id,
      name: friend.name,
      email: friend.email,
    });
    await group.save();
    // **Update the friend's groups array**
    friend.groups.push(group._id);
    await friend.save();
    res
      .status(201)
      .json({ message: "Friend added to group successfully", group });
  } catch (error) {
    console.error("Error adding friend to group:", error);
    res.status(500).json({ error: "Failed to add friend to group" });
  }
};

const getUserGroups = async (req, res) => {
  try {
    // Assuming req.user contains the authenticated user's ID
    const userId = req.user.userId;

    // Populate the groups from the user's document
    const user = await User.findById(userId).populate('groups', 'name');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.groups);
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getUserGroups };

module.exports = {
  createGroup,
  addMember,
  removeMember,
  leaveGroup,
  editGroup,
  addFriendstoGroup,
  getUserGroups
};
