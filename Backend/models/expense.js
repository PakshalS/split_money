const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  originalAmount: {
    type: Number,
    required: true,
  },
  paidBy: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  splitAmongst: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
