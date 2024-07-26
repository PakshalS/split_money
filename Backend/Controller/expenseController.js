const Group = require('../models/Group');
const Expense = require('../models/expense');



const editExpense = async (req, res) => {
  try {
    const { groupId, expenseId, name, amount, paidBy, splitAmongst } = req.body;
    const adminId = req.user.userId;

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
      const userBalance = group.balances.find(b => b.name === user.name && b.email === user.email);
      if (userBalance) {
        userBalance.balance += originalSplitAmount;
      }
    });

    expense.paidBy.forEach(payer => {
      const payerBalance = group.balances.find(b => b.name === payer.name && b.email === payer.email);
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
      let userBalance = group.balances.find(b => b.name === user.name && b.email === user.email);
      if (userBalance) {
        userBalance.balance -= newSplitAmount;
      } else {
        group.balances.push({
          userId: user.userId,
          name: user.name,
          email: user.email,
          balance: -newSplitAmount
        });
      }
    });

    paidBy.forEach(payer => {
      let payerBalance = group.balances.find(b => b.name === payer.name && b.email === payer.email);
      if (payerBalance) {
        payerBalance.balance += payer.amount;
      } else {
        group.balances.push({
          userId: payer.userId,
          name: payer.name,
          email: payer.email,
          balance: payer.amount
        });
      }
    });

    await group.save();
    res.status(200).json({ message: 'Expense edited successfully', expense });
  } catch (error) {
    console.error('Error editing expense:', error);
    res.status(500).json({ error: 'Failed to edit expense' });
  }
};
const deleteExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.body;
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
      const userBalance = group.balances.find(b => b.name === user.name && b.email === user.email);
      if (userBalance) {
        userBalance.balance += splitAmount;
      }
    });

    expense.paidBy.forEach(payer => {
      const payerBalance = group.balances.find(b => b.name === payer.name && b.email === payer.email);
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
editExpense,
deleteExpense
};
