const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
    },
  ],
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  balances: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      balance: {
        type: Number,
        default: 0,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
    },
  ],
  transactionHistory: [
    {
      type: {
        type: String,
        enum: ['settlement'], // You can add more types as needed
        required: true,
      },
      payer: {
        name: { type: String, required: true },
      },
      receiver: {
        name: { type: String, required: true },
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Group", groupSchema);
