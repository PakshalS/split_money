const Group = require('../models/Group');
const Expense = require('../models/expense');


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

const settleUp = async (req, res) => {
  try {
    const { groupId, payer, receiver, amount } = req.body;
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

    if (payerBalance) {
      payerBalance.balance += amount; // payer's balance should increase as they pay off their debt
    } else {
      return res.status(400).json({ error: 'Payer not found in group balances' });
    }

    if (receiverBalance) {
      receiverBalance.balance -= amount; // receiver's balance should decrease as they receive the payment
    } else {
      return res.status(400).json({ error: 'Receiver not found in group balances' });
    }

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
settleUp,
editExpense,
deleteExpense
};
