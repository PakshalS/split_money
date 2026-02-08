// Complete 40-step guided tour for Split Money app

export const tourSteps = [
  // ========================================
  // GROUP CREATION FLOW (Steps 0-12)
  // ========================================
  
  // Step 0: Welcome
  {
    element: "body",
    popover: {
      title: "Welcome to Split Money! 👋",
      description: "Let's take a quick tour to show you how to split expenses with friends and groups. This will take about 2 minutes.",
      side: "center",
    },
  },

  // Step 1: Create Group - Click FAB
  {
    element: ".create-group-fab",
    popover: {
      title: "Create Your First Group",
      description: "Tap this button to create a new group for splitting expenses.",
      side: "left",
      align: "start",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 2: Enter Group Name
  {
    element: ".group-name-input",
    popover: {
      title: "Name Your Group",
      description: "Give your group a name like 'Roommates', 'Trip to Paris', or 'Office Lunch'.",
      side: "bottom",
      showButtons: ["next", "close"]
    },
    action: "input",
    placeholder: "Tour Group",
  },

  // Step 3: Open Menu
  {
    element: ".add-guest-button",
    popover: {
      title: "Open Menu",
      description: "Tap the three-dot menu to see options for adding members.",
      side: "bottom",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 4: Click Add Guest Option
  {
    element: ".dropdown-add-guest-option",
    popover: {
      title: "Add Guests",
      description: "Since you don't have friends added yet, let's add guests by email. Tap here.",
      side: "bottom",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 5: Enter First Guest Name
  {
    element: ".guest-name-input-0",
    popover: {
      title: "Enter Guest Name",
      description: "Type the name of the first person you want to add to this group. (Name is required)",
      side: "bottom",
      showButtons: ["next", "close"]
    },
    action: "input",
    placeholder: "John Doe",
  },

  // Step 6: Add Another Guest Button
  {
    element: ".add-another-guest-button",
    popover: {
      title: "Add More Guests",
      description: "Tap here to add another guest to your group.",
      side: "bottom",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 7: Enter Second Guest Name
  {
    element: ".guest-name-input-1",
    popover: {
      title: "Add Second Guest",
      description: "Enter the name of another person to add to this group.",
      side: "bottom",
      showButtons: ["next", "close"]
    },
    action: "input",
    placeholder: "Jane Smith",
  },

  // Step 8: Done Adding Guests
  {
    element: ".guest-modal-done-button",
    popover: {
      title: "Finish Adding Guests",
      description: "Great! Now tap 'Done' to close this modal.",
      side: "top",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 9: Create Group - Send Button
  {
    element: ".create-group-send-button",
    popover: {
      title: "Create the Group",
      description: "Perfect! Now tap the send button to create your group.",
      side: "top",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 10: Open the Group
  {
    element: ".newly-created-group-item",
    popover: {
      title: "Open Your Group",
      description: "Tap on your group to open it and start adding expenses.",
      side: "right",
    },
    requireInteraction: true,
    action: "click",
    waitForNavigation: true,
  },

  // ========================================
  // EXPENSE CREATION FLOW (Steps 11-22)
  // ========================================

  // Step 11: Highlight Add Button
  {
    element: ".plus-button-action",
    popover: {
      title: "Add Your First Expense",
      description: "As the group admin, you can add expenses. Tap this button to get started.",
      side: "left",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 12: Action Menu Opens
  {
    element: ".action-menu-add-expense",
    popover: {
      title: "Choose 'Add Expense'",
      description: "Select 'Add Expense' to record a new expense for the group.",
      side: "left",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 13: Expense Name
  {
    element: ".expense-name-input",
    popover: {
      title: "Describe the Expense",
      description: "Enter what this expense was for, like 'Dinner', 'Groceries', or 'Movie tickets'.",
      side: "bottom",
      showButtons: ["next", "close"]
    },
    action: "input",
    placeholder: "Lunch",
  },

  // Step 14: Total Amount
  {
    element: ".expense-amount-input",
    popover: {
      title: "Enter Total Amount",
      description: "Type the total amount spent on this expense.",
      side: "bottom",
      showButtons: ["next", "close"]
    },
    action: "input",
    placeholder: "300",
  },

  // Step 15: Next to Paid By
  {
    element: ".expense-next-button",
    popover: {
      title: "Continue",
      description: "Tap 'Next' to specify who paid for this expense.",
      side: "top",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 16: Paid By Section
  {
    element: ".paid-by-section",
    popover: {
      title: "Who Paid?",
      description: "Enter how much each person paid. Often just one person pays the full amount.",
      side: "top",
      showButtons: ["next", "close"],
    },
  },

  // Step 17: Next to Split Amongst
  {
    element: ".expense-next-button",
    popover: {
      title: "Continue to Split",
      description: "Now tap 'Next' to decide how to split this expense.",
      side: "top",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 18: Split Amongst Section
  {
    element: ".split-amongst-section",
    popover: {
      title: "Split the Expense",
      description: "Specify how much each person owes. You can split equally or enter custom amounts.",
      side: "top",
      showButtons: ["next", "close"],
    },
  },

  // Step 19: Split Equally Button
  {
    element: ".split-equally-button",
    popover: {
      title: "Quick Tip: Split Equally",
      description: "For convenience, you can tap 'Split Equally' to divide the amount evenly among all members.",
      side: "bottom",
      showButtons: ["next", "close"]
    },
  },

  // Step 20: Add Expense Button
  {
    element: ".add-expense-submit-button",
    popover: {
      title: "Save the Expense",
      description: "All set! Tap 'Add Expense' to save this expense to your group.",
      side: "top",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 21: Back to Chat View
  {
    element: ".expense-timeline",
    popover: {
      title: "Expense Added!",
      description: "Your expense has been added to the group timeline. You can see all expenses here.",
      side: "top",
      showButtons: ["next", "close"]
    },
  },

  // Step 22: Expense Item in Timeline (Expense Details)
  {
    element: ".expense-item:last-child",
    popover: {
      title: "View Expense Details",
      description: "Each expense shows who paid, how it's split, and the amounts. You can tap to edit or delete.",
      side: "left",
      showButtons: ["next", "close"]
    },
  },

  // ========================================
  // GROUP INFO & SUMMARY (Steps 23-26)
  // ========================================

  // Step 23: Open Group Info
  {
    element: ".group-info-banner",
    popover: {
      title: "Group Information",
      description: "Tap on the group name to see group details, member balances, and quick settlement options.",
      side: "bottom",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 24: Summary Section
  {
    element: ".summary-section",
    popover: {
      title: "Balance Summary",
      description: "This summary shows who owes whom. It calculates the simplest way to settle all debts.",
      side: "left",
      showButtons: ["next", "close"]
    },
  },

  // Step 25: Summary Item
  {
    element: ".summary-item:first-child",
    popover: {
      title: "Settlement Suggestion",
      description: "Each line shows a suggested payment. For example: 'Alice owes Bob $50'.",
      side: "left",
      showButtons: ["next", "close"]
    },
  },

  // Step 26: Settle Up Icon
  {
    element: ".settle-up-action-button",
    popover: {
      title: "Quick Settle Up",
      description: "Tap this icon to quickly record a settlement for this balance.",
      side: "left",
    },
    requireInteraction: true,
    action: "click",
  },

  // ========================================
  // SETTLE-UP CREATION (Steps 27-31)
  // ========================================

  // Step 27: Settle Up Form Opens
  {
    element: ".settle-up-form",
    popover: {
      title: "Settle Up Form",
      description: "This form is pre-filled based on the balance you selected. Review and confirm the details.",
      side: "top",
      showButtons: ["next", "close"]
    },
  },

  // Step 28: Payer Field
  {
    element: ".settle-up-payer",
    popover: {
      title: "Who is Paying?",
      description: "This shows who will make the payment to settle the debt.",
      side: "bottom",
      showButtons: ["next", "close"]
    },
  },

  // Step 29: Receiver Field
  {
    element: ".settle-up-receiver",
    popover: {
      title: "Who is Receiving?",
      description: "This shows who will receive the payment.",
      side: "bottom",
      showButtons: ["next", "close"]
    },
  },

  // Step 30: Amount Field
  {
    element: ".settle-up-amount",
    popover: {
      title: "Settlement Amount",
      description: "The amount that will settle this particular debt.",
      side: "bottom",
      showButtons: ["next", "close"]
    },
  },

  // Step 31: Add Settle Up Button
  {
    element: ".add-settle-up-button",
    popover: {
      title: "Record Settlement",
      description: "Tap here to record this settlement. This will update everyone's balances.",
      side: "top",
    },
    requireInteraction: true,
    action: "click",
  },

  // ========================================
  // FILTER & MEMBER INFO (Steps 32-35)
  // ========================================

  // Step 32: Open Group Info
  {
    element: ".group-info-banner",
    popover: {
      title: "Member Details",
      description: "Let's check individual member balances. Tap the group name to open group info.",
      side: "bottom",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 33: Member List
  {
    element: ".member-item:nth-child(2)",
    popover: {
      title: "View Member Balance",
      description: "Tap on any member to see detailed balance information and transaction history with them.",
      side: "left",
    },
    requireInteraction: true,
    action: "click",
  },

  // Step 34: Member Info Page
  {
    element: ".member-info-balance",
    popover: {
      title: "Member Balance Details",
      description: "Here you can see exactly how much this member owes or is owed, with a breakdown of all contributions.",
      side: "top",
      showButtons: ["next", "close"]
    },
  },

  // Step 35: Tour Complete
  {
    element: "body",
    popover: {
      title: "🎉 Tour Complete!",
      description: "You're all set! You now know how to create groups, add expenses, settle up, and track balances. Happy splitting!",
      side: "center",
    },
  },
];

export default tourSteps;
