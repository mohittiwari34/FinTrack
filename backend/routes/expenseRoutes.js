const express = require('express');
const { getExpenses, addExpense, deleteExpense, updateExpense, uploadAndOCR } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getExpenses)
    .post(protect, upload.single('receipt'), addExpense);

router.route('/:id')
    .delete(protect, deleteExpense)
    .put(protect, updateExpense);

router.post('/upload-receipt', protect, upload.single('receipt'), uploadAndOCR);

module.exports = router;
