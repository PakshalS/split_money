const Group = require("../models/Group");
const User = require("../models/User");
const Expense = require('../models/expense');

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const adminId = req.user.userId;

    // Get admin details
    const admin = await User.findById(adminId);

    // Track names to ensure uniqueness
    const namesSet = new Set();

    // Process members array and check for duplicate names
    const groupMembers = await Promise.all(
      members.map(async (member) => {
        if (namesSet.has(member.name.toLowerCase())) {
          throw new Error(`Duplicate name detected: ${member.name}`);
        }
        namesSet.add(member.name.toLowerCase());

        if (member.email) {
          const user = await User.findOne({ email: member.email });
          if (user) {
            return { user: user._id, name: user.name, email: user.email };
          }
        }
        return { name: member.name, email: member.email };
      })
    );

    // Add admin as the first member, ensuring no duplicate
    if (namesSet.has(admin.name.toLowerCase())) {
      throw new Error(`Duplicate name detected: ${admin.name}`);
    }
    namesSet.add(admin.name.toLowerCase());

    groupMembers.unshift({
      user: admin._id,
      name: admin.name,
      email: admin.email,
    });

    // Create the group
    const group = new Group({
      name,
      admin: adminId,
      members: groupMembers,
    });

    await group.save();

    // Update each member's groups array
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

    // Check if the requesting user is the admin
    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: 'Only the group admin can delete the group' });
    }

    // Delete associated expenses
    await Expense.deleteMany({ groupId: groupId });

    // Remove group references from users' groups array
    const userUpdates = group.members.map(member =>
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

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Only the group admin can add members" });
    }

    const newMember = members.email
      ? await User.findOne({ email: members.email })
      : null;

    group.members.push(
      newMember
        ? { user: newMember._id, name: newMember.name, email: newMember.email }
        : { name: members.name, email: members.email }
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

const transferAdminRights = async (req, res) => {
  try {
    const { groupId, newAdminId } = req.body;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res.status(403).json({ error: "Only the current admin can transfer admin rights" });
    }

    const newAdmin = group.members.find(member => member.user && member.user.toString() === newAdminId);
    if (!newAdmin) {
      return res.status(400).json({ error: "New admin must be a member of the group" });
    }

    group.admin = newAdmin.user;
    await group.save();

    res.status(200).json({ message: "Admin rights transferred successfully", group });
  } catch (error) {
    console.error("Error transferring admin rights:", error);
    res.status(500).json({ error: "Failed to transfer admin rights" });
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
    const groupId = req.params.groupId;
    const { name } = req.body;
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

const getGroupDetails = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId)
      .populate('admin', 'name email')
      .populate('members.userId', 'name email')
      .populate('expenses')
      .populate('balances.userId', 'name email');

      const balances = group.balances.map(balance => ({
        name: balance.name,
        email: balance.email,
        balance: balance.balance
      }));
      const summary = generateSummary(balances);


    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({summary ,group});

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
    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: 'Only the admin can add expense' });
    }

    const expense = new Expense({ groupId, name, amount, paidBy, splitAmongst });
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
    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: 'Only the group admin can settle balances' });
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

    // Ensure the amount does not exceed the summary amount
    if (amount > summaryEntry.amount) {
      return res.status(400).json({ error: 'Settle amount exceeds outstanding debt' });
    }

    // Update balances
    const payerBalance = group.balances.find(b => b.name === payer.name && (!payer.email || b.email === payer.email));
    const receiverBalance = group.balances.find(b => b.name === receiver.name && (!receiver.email || b.email === receiver.email));

    if (!payerBalance || !receiverBalance) {
      return res.status(400).json({ error: 'Payer or receiver not found in group balances' });
    }

    // Ensure valid bounds before updating
    if (Number(payerBalance.balance) + amount > 0) {
      return res.status(400).json({ error: 'Invalid balance for payer after settlement' });
    }
    if (Number(receiverBalance.balance) - amount < 0) {
      return res.status(400).json({ error: 'Invalid balance for receiver after settlement' });
    }

    // Update balances
    payerBalance.balance = Number(payerBalance.balance) + Number(amount); // Ensure balance is a number
    receiverBalance.balance = Number(receiverBalance.balance) - Number(amount); // Ensure balance is a number



    // Save the updated group with new balances
    await group.save();

    // Recalculate summary after settlement
    const updatedBalances = group.balances.map(b => ({
      name: b.name,
      email: b.email,
      balance: b.balance
    }));
    const updatedSummary = generateSummary(updatedBalances);

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


module.exports = {
  createGroup,
  addMember,
  removeMember,
  leaveGroup,
  editGroup,
  addFriendstoGroup,
  getUserGroups,
  getGroupDetails,
  transferAdminRights,
  addExpense,
  settleUp,
  deleteGroup
};
