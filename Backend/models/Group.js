const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
   joinCode: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values for backwards compatibility
  },
  strictJoin: {
    type: Boolean,
    default: false, // false = easy join, true = needs approval
  },
  joinRequests: [
    {
      requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      requestedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Group", groupSchema);
