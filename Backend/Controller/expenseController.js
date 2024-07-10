// controllers/expenseController.js
const Expense = require('../models/Expense');
const Group = require('../models/Group');

const addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, amount, paidBy, splitAmongst, splitEqually } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const expense = new Expense({
      group: groupId,
      name,
      amount,
      paidBy,
      splitAmongst,
      splitEqually,
    });

    await expense.save();

    // Update balances
    const balances = await updateBalances(groupId);

    res.status(201).json({ message: 'Expense recorded successfully', expense, balances });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

module.exports = { addExpense };
