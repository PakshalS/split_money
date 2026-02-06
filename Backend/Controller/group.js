const Group = require("../models/Group");
const User = require("../models/User");
const Expense = require("../models/expense");

const generateUniqueCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    exists = await Group.exists({ joinCode: code });
  }
  return code;
};

const isGroupAdmin = (group, userId) =>
  group.admins?.some((adminId) => adminId.toString() === userId.toString());

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const adminId = req.user.userId;

    // Get admin details
    const admin = await User.findById(adminId);

    // Track names and emails to ensure uniqueness
    const namesSet = new Set();
    const emailsSet = new Set();

    // Process members array and check for duplicate names and emails
    const groupMembers = await Promise.all(
      members.map(async (member) => {
        if (namesSet.has(member.name.toLowerCase())) {
          throw new Error(`Duplicate name detected: ${member.name}`);
        }
        namesSet.add(member.name.toLowerCase());

        let user = null;

        if (member.email) {
          user = await User.findOne({ email: member.email, name: member.name });
          if (user && emailsSet.has(user.email)) {
            throw new Error(`Duplicate email detected: ${member.email}`);
          }
          emailsSet.add(member.email);

          // Only add the user if both email and name match
          return user
            ? { userId: user._id, name: user.name, email: user.email }
            : { name: member.name, email: member.email };
        } else {
          // If email is not provided, treat the user as non-registered
          return { name: member.name, email: member.email };
        }
      })
    );

    // Add admin as the first member if not already present
    if (!namesSet.has(admin.name.toLowerCase())) {
      namesSet.add(admin.name.toLowerCase());
      if (admin.email) emailsSet.add(admin.email);
      groupMembers.unshift({
        userId: admin._id,
        name: admin.name,
        email: admin.email,
      });
    }

    const joinCode = await generateUniqueCode();

    // Create the group
    const group = new Group({
      name,
      admins: [adminId],
      members: groupMembers,
      joinCode,
      strictJoin: false,
    });

    await group.save();

    // Update each member's groups array
    for (const member of groupMembers) {
      if (member.userId) {
        const user = await User.findById(member.userId);
        user.groups.push(group._id);
        await user.save();
      }
    }

    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: error.message || "Failed to create group" });
  }
};


const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const adminId = req.user.userId;

    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the requesting user is an admin
    if (!isGroupAdmin(group, adminId)) {
      return res.status(403).json({ error: "Only a group admin can delete the group" });
    }

    // Delete associated expenses
    await Expense.deleteMany({ groupId: groupId });

    // Remove group references from users' groups array
    const userUpdates = group.members
      .filter((member) => member.userId)
      .map((member) =>
        User.findByIdAndUpdate(member.userId, { $pull: { groups: groupId } })
      );
    await Promise.all(userUpdates);

    // Delete the group
    await group.deleteOne();

    res.status(200).json({ message: 'Group and associated expenses deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

const addMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { members } = req.body;
    const userId = req.user.userId;

    // Fetch the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Ensure only an admin can add members
    if (!isGroupAdmin(group, userId)) {
      return res.status(403).json({ error: "Only a group admin can add members" });
    }

    const namesSet = new Set(group.members.map((member) => member.name.toLowerCase()));
    const emailsSet = new Set(
      group.members.map((member) => member.email).filter(Boolean)
    );

    for (const member of members) {
      // Check if the name is provided
      if (!member.name) {
        return res.status(400).json({ error: "Name is required for each member" });
      }

      // Check for unique name within the group
      if (namesSet.has(member.name.toLowerCase())) {
        return res.status(400).json({ error: `The name "${member.name}" is already used in the group` });
      }
      namesSet.add(member.name.toLowerCase());

      let user = null;

      if (member.email) {
        user = await User.findOne({ email: member.email, name: member.name });
        if (user && user.email && emailsSet.has(user.email)) {
          return res.status(400).json({ error: `The email "${member.email}" is already used in the group` });
        }
        if (member.email) emailsSet.add(member.email);

        // Only add the user if both email and name match
        if (user) {
          group.members.push({ userId: user._id, name: user.name, email: user.email });
          user.groups.push(group._id);
          await user.save();
        } else {
          group.members.push({ name: member.name, email: member.email });
        }
      } else {
        // If email is not provided, treat the user as non-registered
        group.members.push({ name: member.name, email: member.email });
      }
    }

    await group.save();
    
    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'member-added' });
    
    res.status(200).json({ message: "Members added successfully", group });
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({ error: "Failed to add members" });
  }
};




const removeMember = async (req, res) => {
  try {
    const { groupId, memberName } = req.params;
    const userId = req.user.userId;  // Authenticated user (admin)

    // Fetch the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if the requester is an admin
    if (!isGroupAdmin(group, userId)) {
      return res.status(403).json({ error: "Only a group admin can remove members" });
    }

    // Find the member by name
    const member = group.members.find((member) => member.name === memberName);

    if (!member) {
      return res.status(404).json({ error: "Member not found in the group" });
    }

    // Prevent an admin from removing themselves
    if (member.userId && member.userId.toString() === userId.toString()) {
      return res.status(400).json({ error: "Admins cannot remove themselves" });
    }

    // If the member is an admin, ensure there is at least one admin left
    if (member.userId && isGroupAdmin(group, member.userId)) {
      if (group.admins.length < 2) {
        return res.status(400).json({ error: "Group must have at least one admin" });
      }
      group.admins = group.admins.filter(
        (adminId) => adminId.toString() !== member.userId.toString()
      );
    }

    // Remove the member from the group's members list
    group.members = group.members.filter((member) => member.name !== memberName);

    // Remove the member's balances entry from the group
    group.balances = group.balances.filter((balance) => balance.name !== memberName);

    await group.save();

    // Find the member in the User collection (only if they have a userId)
    if (member.userId) {
      const user = await User.findById(member.userId);
      if (user) {
        // Remove the group from the member's groups list
        user.groups = user.groups.filter((group) => group.toString() !== groupId);
        await user.save();
      }
    }

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'member-removed' });

    res.status(200).json({ message: "Member removed successfully", group });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

const addAdmin = async (req, res) => {
  try {
    const { groupId, memberName } = req.params;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!isGroupAdmin(group, userId)) {
      return res.status(403).json({ error: "Only a group admin can add another admin" });
    }

    const member = group.members.find(
      (m) => m.name.toLowerCase() === memberName.toLowerCase()
    );
    if (!member) {
      return res.status(404).json({ error: "Member not found in the group" });
    }

    if (!member.userId) {
      return res.status(400).json({ error: "Only registered users can be promoted to admin" });
    }

    if (isGroupAdmin(group, member.userId)) {
      return res.status(400).json({ error: "User is already an admin" });
    }

    group.admins.push(member.userId);
    await group.save();

    res.status(200).json({
      message: `${member.name} promoted to admin successfully`,
      group,
    });
  } catch (error) {
    console.error("Error promoting to admin:", error);
    res.status(500).json({ error: "Failed to promote to admin" });
  }
};

const removeAdmin = async (req, res) => {
  try {
    const { groupId, memberName } = req.params;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!isGroupAdmin(group, userId)) {
      return res.status(403).json({ error: "Only a group admin can remove another admin" });
    }

    const member = group.members.find(
      (m) => m.name.toLowerCase() === memberName.toLowerCase()
    );
    if (!member) {
      return res.status(404).json({ error: "Member not found in the group" });
    }

    if (!member.userId || !isGroupAdmin(group, member.userId)) {
      return res.status(400).json({ error: "The specified member is not an admin" });
    }

    if (member.userId.toString() === userId.toString()) {
      return res.status(400).json({ error: "Admins cannot remove themselves" });
    }

    if (group.admins.length < 2) {
      return res.status(400).json({ error: "Group must have at least one admin" });
    }

    group.admins = group.admins.filter(
      (adminId) => adminId.toString() !== member.userId.toString()
    );
    await group.save();

    res.status(200).json({
      message: `${member.name} removed from admin successfully`,
      group,
    });
  } catch (error) {
    console.error("Error removing admin:", error);
    res.status(500).json({ error: "Failed to remove admin" });
  }
};
const transferAdminRights = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newAdminName } = req.body;
    const userId = req.user.userId; // Assuming req.user.userId is set from authentication middleware

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the current user is an admin
    if (!isGroupAdmin(group, userId)) {
      return res.status(403).json({ error: "Only a group admin can transfer admin rights" });
    }

    // Find the member by their name
    const newAdmin = group.members.find(member => member.name === newAdminName);
    if (!newAdmin) {
      return res.status(400).json({ error: 'The new admin must be a member of the group' });
    }

    // Check if the member is a registered user
    const registeredUser = await User.findOne({ name: newAdminName, _id: newAdmin.userId });
    if (!registeredUser) {
      return res.status(400).json({ error: 'Selected member is not a registered user' });
    }

    // Transfer admin rights (replace current admins)
    group.admins = [newAdmin.userId];
    await group.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'admin-transferred' });

    res.status(200).json({ message: 'Admin rights transferred successfully', group });
  } catch (error) {
    console.error('Error transferring admin rights:', error);
    res.status(500).json({ error: 'Failed to transfer admin rights' });
  }
};


const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params; // Get groupId from URL parameters
    const userId = req.user.userId;
    const userName = req.user.name;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const isAdmin = isGroupAdmin(group, userId);
    if (isAdmin && group.admins.length < 2) {
      return res.status(400).json({
        error: "You are the only admin. Please assign another admin before leaving.",
      });
    }

    // Remove the member from the group
    const initialMembersCount = group.members.length;
    group.members = group.members.filter((member) => {
      return member.userId ? member.userId.toString() !== userId : member.name !== userName;
    });

    // Check if member was actually removed
    if (group.members.length === initialMembersCount) {
      return res.status(404).json({ error: "Member not found in the group" });
    }

    if (isAdmin) {
      group.admins = group.admins.filter(
        (adminId) => adminId.toString() !== userId.toString()
      );
    }

    await group.save();

    // Update the user's groups array if the user is registered
    const user = await User.findById(userId);
    if (user) {
      user.groups = user.groups.filter((group) => group.toString() !== groupId);
      await user.save();
    }

    res.status(200).json({ message: "Left group successfully", group });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ error: "Failed to leave group" });
  }
};


const editGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { name, strictJoin } = req.body;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!isGroupAdmin(group, userId)) {
      return res
        .status(403)
        .json({ error: "Only a group admin can edit group details" });
    }

    if (name) group.name = name;
    if (strictJoin !== undefined) group.strictJoin = strictJoin;
    
    await group.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'group-edited' });

    res
      .status(200)
      .json({ message: "Group details updated successfully", group });
  } catch (error) {
    console.error("Error editing group:", error);
    res.status(500).json({ error: "Failed to edit group" });
  }
};

const getGroupInviteLink = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!isGroupAdmin(group, userId)) {
      return res.status(403).json({ error: "Only admins can generate invite links" });
    }

    if (!group.joinCode) {
      group.joinCode = await generateUniqueCode();
      await group.save();
    }

    const inviteLink = `${process.env.FRONTEND_URL}/group/join/${group.joinCode}`;
    res.json({ inviteLink });
  } catch (error) {
    console.error("Error generating group invite link:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const joinGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const joinCode = req.params.joinCode || req.body.joinCode;

    if (!joinCode) {
      return res.status(400).json({ error: "Join code is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const group = await Group.findOne({ joinCode });
    if (!group) {
      return res.status(404).json({ error: "Invalid join code" });
    }

    const alreadyMember = group.members.some(
      (m) => m.userId?.toString() === user._id.toString() || m.email === user.email
    );
    if (alreadyMember) {
      return res.status(400).json({ error: "Already a member of this group" });
    }

    const pendingRequest = group.joinRequests?.some(
      (r) => r.requester?.toString() === user._id.toString() && r.status === "pending"
    );
    if (pendingRequest) {
      return res.status(400).json({ error: "You already have a pending join request for this group" });
    }

    const namesSet = new Set(group.members.map((m) => m.name.toLowerCase()));
    const emailsSet = new Set(group.members.map((m) => m.email).filter(Boolean));

    if (namesSet.has(user.name.toLowerCase()) || emailsSet.has(user.email)) {
      return res.status(400).json({ error: "Your name or email already exists in the group" });
    }

    if (group.strictJoin) {
      group.joinRequests.push({ requester: user._id });
      await group.save();
      
      // Populate to get full group data
      const populatedGroup = await Group.findById(group._id)
        .populate('admins', 'name email')
        .populate('members.userId', 'name email')
        .populate('expenses')
        .populate('joinRequests.requester', 'name email _id');
      
      return res.json({ 
        message: "Join request submitted, awaiting admin approval",
        group: populatedGroup 
      });
    }

    group.members.push({
      userId: user._id,
      name: user.name,
      email: user.email,
    });

    if (!user.groups.includes(group._id)) {
      user.groups.push(group._id);
      await user.save();
    }

    await group.save();
    
    // Populate to get full group data
    const populatedGroup = await Group.findById(group._id)
      .populate('admins', 'name email')
      .populate('members.userId', 'name email')
      .populate('expenses')
      .populate('joinRequests.requester', 'name email _id');
    
    return res.json({ 
      message: "Joined successfully",
      group: populatedGroup 
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ error: "Server error" });
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

    if (!isGroupAdmin(group, userId)) {
      return res
        .status(403)
        .json({ error: "Only a group admin can add members" });
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
    const userId = req.user.userId;
    const search = req.query.search || "";

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const groupQuery = {
      _id: { $in: user.groups },
      name: { $regex: search, $options: "i" },
    };

    const groups = await Group.find(groupQuery)
      .sort({ createdAt: -1 })
      .select("name createdAt admins members");

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getGroupDetails = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId)
      .populate('admins', 'name email')
      .populate('members.userId', 'name email')
      .populate('expenses')
      .populate('expenses.createdBy', 'name email')
      .populate('balances.userId', 'name email')
      .populate('transactionHistory.createdBy', 'name email')
      .populate('joinRequests.requester', 'name email _id');

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      const balances = group.balances.map(balance => ({
        name: balance.name,
        email: balance.email,
        balance: balance.balance
      }));
      const summary = generateSummary(balances);

      // Calculate total spend for each member
      const membersWithSpend = group.members.map(member => ({
        userId: member.userId,
        name: member.name,
        email: member.email,
        totalSpend: calculateTotalSpend(group, member.name)
      }));

    res.status(200).json({summary, group, membersWithSpend});

  } catch (error) {
    console.error('Error fetching group details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const addExpense = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { name, amount, paidBy, splitAmongst } = req.body;
    const adminId = req.user.userId;

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" });
    }

    paidBy.forEach(payer => {
      if (payer.amount <= 0) {
        return res.status(400).json({ error: "Paid amount must be greater than zero" });
      }
    });

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    if (!isGroupAdmin(group, adminId)) {
      return res.status(403).json({ error: "Only a group admin can add expense" });
    }

    const expense = new Expense({ 
      groupId, 
      name, 
      amount, 
      paidBy, 
      splitAmongst,
      createdBy: adminId 
    });
    await expense.save();
    group.expenses.push(expense._id);

    const splitAmount = amount / splitAmongst.length;

    splitAmongst.forEach(user => {
      let userBalance = group.balances.find(b => b.name === user.name);
      if (userBalance) {
        userBalance.balance -= splitAmount;
      } else {
        group.balances.push({
          name: user.name,
          balance: -splitAmount
        });
      }
    });

    paidBy.forEach(payer => {
      let payerBalance = group.balances.find(b => b.name === payer.name);
      if (payerBalance) {
        payerBalance.balance += payer.amount;
      } else {
        group.balances.push({
          name: payer.name,
          balance: payer.amount
        });
      }
    });

    await group.save();
    
    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'expense-added' });
    
    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

const settleUp = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { payer, receiver, amount } = req.body;
    const adminId = req.user.userId;

    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    if (!isGroupAdmin(group, adminId)) {
      return res.status(403).json({ error: "Only a group admin can settle balances" });
    }

    // Recalculate summary
    const balances = group.balances.map(b => ({
      name: b.name,
      email: b.email,
      balance: b.balance
    }));
    const summary = generateSummary(balances);

    // Find the relevant summary entry
    const summaryEntry = summary.find(s => s.from === payer.name && s.to === receiver.name);
    if (!summaryEntry) {
      return res.status(400).json({ error: 'No outstanding debt found between these members' });
    }

    // Allow partial settlements - just check that amount doesn't exceed the debt
    let settlementAmount = Number(amount);
    const owedAmount = summaryEntry.amount;
    
    // Check if the rounded amounts match (to 2 decimals)
    // If user is settling the "display amount", use the actual precise amount
    if (Math.abs(settlementAmount.toFixed(2) - owedAmount.toFixed(2)) < 0.01) {
      settlementAmount = owedAmount;
    } else if (settlementAmount > owedAmount) {
      return res.status(400).json({ error: 'Settle amount exceeds outstanding debt' });
    }

    if (settlementAmount <= 0) {
      return res.status(400).json({ error: 'Settlement amount must be greater than zero' });
    }

    // Update balances
    const payerBalance = group.balances.find(b => b.name === payer.name && (!payer.email || b.email === payer.email));
    const receiverBalance = group.balances.find(b => b.name === receiver.name && (!receiver.email || b.email === receiver.email));

    if (!payerBalance || !receiverBalance) {
      return res.status(400).json({ error: 'Payer or receiver not found in group balances' });
    }

    // Update balances with the settled amount
    payerBalance.balance = Number(payerBalance.balance) + Number(settlementAmount);
    receiverBalance.balance = Number(receiverBalance.balance) - Number(settlementAmount);

    // Record the transaction history for transparency
    group.transactionHistory.push({
      type: 'settlement',
      payer: { name: payer.name},
      receiver: { name: receiver.name},
      amount: settlementAmount,
      createdBy: adminId,
      date: new Date(),
    });

    // Save the updated group with new balances
    await group.save();

    // Recalculate summary after settlement
    const updatedBalances = group.balances.map(b => ({
      name: b.name,
      email: b.email,
      balance: b.balance
    }));
    const updatedSummary = generateSummary(updatedBalances);

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'settlement-added' });

    res.status(200).json({ message: 'Balance settled successfully', summary: updatedSummary });
  } catch (error) {
    console.error('Error settling balance:', error);
    res.status(500).json({ error: 'Failed to settle balance' });
  }
};

const generateSummary = (balances) => {
  const debtors = balances.filter(b => b.balance < 0);
  const creditors = balances.filter(b => b.balance > 0);

  let summary = [];

  creditors.forEach(creditor => {
    debtors.forEach(debtor => {
      if (debtor.balance < 0 && creditor.balance > 0) {
        const amount = Math.min(creditor.balance, -debtor.balance);
        summary.push({
          from: debtor.name,
          to: creditor.name,
          amount: amount
        });
        creditor.balance -= amount;
        debtor.balance += amount;
      }
    });
  });

  return summary;
};

const calculateTotalSpend = (group, memberName) => {
  let totalSpend = 0;

  // Step 1: Sum all amounts paid by this user in all expenses
  group.expenses.forEach(expense => {
    const paidByUser = expense.paidBy.find(p => p.name === memberName);
    if (paidByUser) {
      totalSpend += paidByUser.amount;
    }
  });

  // Step 2: Add amounts where this user was the payer in settlements
  group.transactionHistory.forEach(transaction => {
    if (transaction.type === 'settlement') {
      if (transaction.payer.name === memberName) {
        totalSpend += transaction.amount;
      }
      // Step 3: Subtract amounts where this user was the receiver in settlements
      if (transaction.receiver.name === memberName) {
        totalSpend -= transaction.amount;
      }
    }
  });

  return totalSpend;
};

const editExpense = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const expenseId = req.params.expenseId;
    const { name, amount, paidBy, splitAmongst } = req.body;
    const adminId = req.user.userId;

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" });
    }

    paidBy.forEach(payer => {
      if (payer.amount <= 0) {
        return res.status(400).json({ error: "Paid amount must be greater than zero" });
      }
    });

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    if (!isGroupAdmin(group, adminId)) {
      return res.status(403).json({ error: "Only a group admin can edit expense" });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Revert the original balances
    const originalSplitAmount = expense.amount / expense.splitAmongst.length;
    expense.splitAmongst.forEach(user => {
      const userBalance = group.balances.find(b => b.name === user.name);
      if (userBalance) {
        userBalance.balance += originalSplitAmount;
      }
    });

    expense.paidBy.forEach(payer => {
      const payerBalance = group.balances.find(b => b.name === payer.name);
      if (payerBalance) {
        payerBalance.balance -= payer.amount;
      }
    });

    // Update expense details
    expense.name = name;
    expense.amount = amount;
    expense.paidBy = paidBy;
    expense.splitAmongst = splitAmongst;
    await expense.save();

    // Apply the new balances
    const newSplitAmount = amount / splitAmongst.length;
    splitAmongst.forEach(user => {
      let userBalance = group.balances.find(b => b.name === user.name);
      if (userBalance) {
        userBalance.balance -= newSplitAmount;
      } else {
        group.balances.push({
          name: user.name,
          balance: -newSplitAmount
        });
      }
    });

    paidBy.forEach(payer => {
      let payerBalance = group.balances.find(b => b.name === payer.name);
      if (payerBalance) {
        payerBalance.balance += payer.amount;
      } else {
        group.balances.push({
          name: payer.name,
          balance: payer.amount
        });
      }
    });

    // Save the updated group with new balances
    await group.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'expense-edited' });

    res.status(200).json({ message: 'Expense edited successfully', expense });
  } catch (error) {
    console.error('Error editing expense:', error);
    res.status(500).json({ error: 'Failed to edit expense' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const expenseId = req.params.expenseId;
    const adminId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    if (!isGroupAdmin(group, adminId)) {
      return res.status(403).json({ error: "Only a group admin can delete expense" });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Revert the balances
    const splitAmount = expense.amount / expense.splitAmongst.length;
    expense.splitAmongst.forEach(user => {
      const userBalance = group.balances.find(b => b.name === user.name);
      if (userBalance) {
        userBalance.balance += splitAmount;
      }
    });

    expense.paidBy.forEach(payer => {
      const payerBalance = group.balances.find(b => b.name === payer.name);
      if (payerBalance) {
        payerBalance.balance -= payer.amount;
      }
    });

    await Expense.findByIdAndDelete(expenseId);
    group.expenses = group.expenses.filter(expId => expId.toString() !== expenseId);
    await group.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'expense-deleted' });

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

const approveJoinRequest = async (req, res) => {
  try {
    const { groupId, requesterId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!isGroupAdmin(group, userId)) {
      return res.status(403).json({ error: "Only a group admin can approve join requests" });
    }

    // Find the join request
    const requestIndex = group.joinRequests.findIndex(
      (req) => req.requester.toString() === requesterId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Join request not found" });
    }

    // Get the requester's user info
    const requester = await User.findById(requesterId);
    if (!requester) {
      return res.status(404).json({ error: "Requester not found" });
    }

    // Add the user as a member to the group
    const isMemberExists = group.members.some(
      (member) => member.userId && member.userId.toString() === requesterId
    );

    if (!isMemberExists) {
      group.members.push({
        userId: requester._id,
        name: requester.name,
        email: requester.email,
      });

      // Add balance entry for the new member
      group.balances.push({
        userId: requester._id,
        name: requester.name,
        email: requester.email,
        balance: 0,
      });

      // Update user's groups
      if (!requester.groups.includes(groupId)) {
        requester.groups.push(groupId);
        await requester.save();
      }
    }

    // Remove the accepted request from joinRequests array
    group.joinRequests.splice(requestIndex, 1);
    await group.save();

    // Populate the group to return fresh data
    const populatedGroup = await Group.findById(groupId)
      .populate('admins', 'name email')
      .populate('members.userId', 'name email')
      .populate('expenses')
      .populate('joinRequests.requester', 'name email _id');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'member-joined', userId: requesterId });

    res.status(200).json({
      message: `${requester.name} has been approved and added to the group`,
      group: populatedGroup,
    });
  } catch (error) {
    console.error("Error approving join request:", error);
    res.status(500).json({ error: "Failed to approve join request" });
  }
};

const rejectJoinRequest = async (req, res) => {
  try {
    const { groupId, requesterId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!isGroupAdmin(group, userId)) {
      return res.status(403).json({ error: "Only a group admin can reject join requests" });
    }

    // Find the join request
    const requestIndex = group.joinRequests.findIndex(
      (req) => req.requester.toString() === requesterId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Join request not found" });
    }

    // Remove the rejected request from joinRequests array
    group.joinRequests.splice(requestIndex, 1);
    await group.save();

    // Populate the group to return fresh data
    const populatedGroup = await Group.findById(groupId)
      .populate('admins', 'name email')
      .populate('members.userId', 'name email')
      .populate('expenses')
      .populate('joinRequests.requester', 'name email _id');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('group-updated', { groupId, action: 'request-rejected', userId: requesterId });

    res.status(200).json({
      message: "Join request has been rejected",
      group: populatedGroup,
    });
  } catch (error) {
    console.error("Error rejecting join request:", error);
    res.status(500).json({ error: "Failed to reject join request" });
  }
};

module.exports = {
  createGroup,
  addMember,
  removeMember,
  addAdmin,
  removeAdmin,
  leaveGroup,
  editGroup,
  addFriendstoGroup,
  getUserGroups,
  getGroupDetails,
  transferAdminRights,
  getGroupInviteLink,
  joinGroup,
  addExpense,
  settleUp,
  deleteGroup,
  editExpense,
  deleteExpense,
  approveJoinRequest,
  rejectJoinRequest

};
