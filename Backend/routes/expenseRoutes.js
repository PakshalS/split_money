const express = require('express');
const Router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const {addExpense,settleUp,getBalances} = require('../Controller/expenseController')

Router.post('/expense',authenticateJWT,addExpense);
Router.post('/balances',authenticateJWT,getBalances);
Router.post('/settleup',authenticateJWT,settleUp);
    