const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const { editExpense, deleteExpense} = require('../Controller/expenseController')

router.put('/editexpense',authenticateJWT,editExpense);
router.delete('/deleteexpense',authenticateJWT,deleteExpense);


module.exports = router;