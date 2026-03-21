const Income = require('../models/Income');

// @desc    Get all incomes
// @route   GET /api/incomes
// @access  Private
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: incomes.length, data: incomes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Add new income
// @route   POST /api/incomes
// @access  Private
exports.addIncome = async (req, res) => {
    try {
        req.body.userId = req.user.id;
        const income = await Income.create(req.body);
        res.status(201).json({ success: true, data: income });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        } else {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
