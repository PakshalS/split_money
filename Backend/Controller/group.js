const Group = require("../models/Group");
const User = require("../models/User");
const Expense = require('../models/expense');

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
          user = await User.findOne({ email: member.email });
          if (user && emailsSet.has(user.email)) {
            throw new Error(`Duplicate email detected: ${member.email}`);
          }
          emailsSet.add(member.email);
        } else if (member.name) {
          user = await User.findOne({ name: member.name });
          if (user && emailsSet.has(user.email)) {
            throw new Error(`Duplicate email detected: ${user.email}`);
          }
          emailsSet.add(user ? user.email : '');
        }

        return user
          ? { userId: user._id, name: user.name, email: user.email }
          : { name: member.name, email: member.email };
      })
    );

    // Add admin as the first member, ensuring no duplicate
    if (namesSet.has(admin.name.toLowerCase())) {
      throw new Error(`Duplicate name detected: ${admin.name}`);
    }
    if (emailsSet.has(admin.email)) {
      throw new Error(`Duplicate email detected: ${admin.email}`);
    }

    groupMembers.unshift({
      userId: admin._id,
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

    // Fetch the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Ensure only the admin can add members
    if (group.admin.toString() !== userId) {
      return res.status(403).json({ error: "Only the group admin can add members" });
    }

    for (const member of members) {
      // Check if the name is provided
      if (!member.name) {
        return res.status(400).json({ error: "Name is required for each member" });
      }

      // Check for unique name within the group
      if (group.members.some(existingMember => existingMember.name.toLowerCase() === member.name.toLowerCase())) {
        return res.status(400).json({ error: `The name "${member.name}" is already used in the group` });
      }

      // If the email is not provided, try to fetch it from the registered user by name
      let registeredUser = null;
      if (member.name && !member.email) {
        registeredUser = await User.findOne({ name: member.name });
        if (registeredUser) {
          member.email = registeredUser.email;
        }
      } else if (member.email) {
        registeredUser = await User.findOne({ email: member.email });
      }

      // Check for unique email within the group, if email is provided
      if (member.email && group.members.some(existingMember => existingMember.email === member.email)) {
        return res.status(400).json({ error: `The email "${member.email}" is already used in the group` });
      }

      // Add the member to the group
      group.members.push(
        registeredUser
          ? { user: registeredUser._id, name: registeredUser.name, email: registeredUser.email }
          : { name: member.name, email: member.email }
      );

      // Update the new member's groups array if they are registered
      if (registeredUser) {
        registeredUser.groups.push(group._id);
        await registeredUser.save();
      }
    }

    await group.save();
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

    // Check if the requester is the admin
    if (group.admin.toString() !== userId) {
      return res.status(403).json({ error: "Only the group admin can remove members" });
    }

    // Find the member by name
    const member = group.members.find((member) => member.name === memberName);

    if (!member) {
      return res.status(404).json({ error: "Member not found in the group" });
    }

    // Prevent the admin from removing themselves
    if (member.userId && group.admin.toString() === member.userId.toString()) {
      return res.status(400).json({ error: "Admin cannot remove themselves" });
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

    res.status(200).json({ message: "Member removed successfully", group });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ error: "Failed to remove member" });
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

    // Check if the current user is the admin
    if (group.admin.toString() !== userId) {
      return res.status(403).json({ error: 'Only the current admin can transfer admin rights' });
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

    // Transfer admin rights
    group.admin = newAdmin.userId;
    await group.save();

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

    // If the admin is trying to leave, prevent them from doing so
    if (group.admin.toString() === userId) {
      return res.status(400).json({ error: "Admin cannot leave the group. Please transfer admin rights first." });
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
      .populate('balances.userId', 'name email')
      .populate('transactionHistory.type', 'payer receiver amount');

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
    // Update balances with the settled amount
    payerBalance.balance = Number(payerBalance.balance) + Number(amount); // Ensure balance is a number
    receiverBalance.balance = Number(receiverBalance.balance) - Number(amount); // Ensure balance is a number

    // Record the transaction history for transparency
    group.transactionHistory.push({
      type: 'settlement',
      payer: { name: payer.name},
      receiver: { name: receiver.name},
      amount,
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
    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: 'Only the admin can edit expense' });
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
    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: 'Only the admin can delete expense' });
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

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
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
  deleteGroup,
  editExpense,
  deleteExpense
};
