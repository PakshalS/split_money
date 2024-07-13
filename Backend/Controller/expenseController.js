const Group = require('../models/Group');
const Expense = require('../models/expense');

const addExpense = async (req, res) => {
  try {
    const {groupId, name , amount , paidBy , splitAmongst} =req.body;
    const adminId = req.user.userId;

    const group = await Group.findById(groupId);
    if(!group)
    {
      return res.status(404).json({error:"Group not found"});
    }
    if(group.admin.toString()!=adminId)
    {
      return res.status(404).json({error:'Only the admin can add expense'});
    }

    const expense = new Expense({groupId,name,amount,paidBy,splitAmongst});
    await expense.save();
    group.expenses.push(expense._id);

    const splitAmount = amount/splitAmongst.length;
    
    
    splitAmongst.forEach(user => {
      let userBalance = group.balances.find(b => b.name === user.name && b.email === user.email);
      if (userBalance) {
        userBalance.balance -= splitAmount;
      } else {
        group.balances.push({
          userId: user.userId,
          name: user.name,
          email: user.email,
          balance: -splitAmount
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
    res.status(201).json({message:'Expense added successfully', expense});
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
}
const getBalances = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const balances = group.balances.map(balance => ({
      name: balance.name,
      email: balance.email,
      balance: balance.balance
    }));

    const summary = generateSummary(balances);
    res.status(200).json({ balances: group.balances, summary });
  } catch (error) {
    console.error('Error getting balances:', error);
    res.status(500).json({ error: 'Failed to get balances' });
  }
};

const settleUp = async (req, res) => {
  try {
    const { groupId, payer, receiver, amount } = req.body;
    const adminId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: 'Only the group admin can settle balances' });
    }

    const payerBalance = group.balances.find(b => b.name === payer.name && b.email === payer.email);
    const receiverBalance = group.balances.find(b => b.name === receiver.name && b.email === receiver.email);

    if (!payerBalance || !receiverBalance) {
      return res.status(400).json({ error: 'Invalid payer or receiver' });
    }

    payerBalance.balance -= amount;
    receiverBalance.balance += amount;

    await group.save();
    res.status(200).json({ message: 'Balance settled successfully' });
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
addExpense,
getBalances,
settleUp,
editExpense,
deleteExpense
};
