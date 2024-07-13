const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const {addExpense,settleUp,getBalances} = require('../Controller/expenseController')

router.post('/expense',authenticateJWT,addExpense);
router.get('/balances',authenticateJWT,getBalances);
router.post('/settleup',authenticateJWT,settleUp);


module.exports = router;