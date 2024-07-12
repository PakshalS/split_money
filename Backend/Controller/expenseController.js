const Group = require('../models/Group');
const Expense = require('../models/expense');

const addExpense = async (req, res) => {
  try {
    const {groupId, name , amount , paidBy , splitAmongst} =req.body;
    const adminId = req.user.userId;

    const group = await Group.findById(groupid);
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
    
    
    splitAmongst.forEach((member)=>{
      const userBalance = group.balances.find(b=> b.name === member.name && b.email === member.email);
      if (userBalance)
      {
        userBalance.balance -= member.amount;
      }
      else{
        group.balances.push({
          userId: member.userId,
          name: member.name,
          email: member.email,
          balance: -splitAmount
        });
      }
    });
    paidBy.forEach((payer)=>{
      const userBalance =group.balances.find(b=> b.name=== payer.name && b.email === payer.email);
      if(userBalance)
      {
        userBalance.balance += payer.amount;
      }
      else{
        group.balances.push({
          userId: payer.userId,
          name: payer.name,
          email: payer.email,
          balance: payer.amount,
        });}
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
    const {groupId} = req.body;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({ balances: group.balances });
    
  } catch (error) {
    console.error('Error getting balances:', error);
    res.status(500).json({ error: 'Failed to get balances' });
  }
}


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
}
module.exports = {
addExpense,
getBalances,
settleUp
};
