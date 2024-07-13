const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const {addExpense,settleUp,getBalances, editExpense, deleteExpense} = require('../Controller/expenseController')

router.post('/expense',authenticateJWT,addExpense);
router.get('/balances',authenticateJWT,getBalances);
router.post('/settleup',authenticateJWT,settleUp);
router.put('/editexpense',authenticateJWT,editExpense);
router.delete('/deleteexpense',authenticateJWT,deleteExpense);


module.exports = router;