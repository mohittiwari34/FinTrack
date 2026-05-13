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

// @desc    Update income
// @route   PUT /api/incomes/:id
// @access  Private
exports.updateIncome = async (req, res) => {
    try {
        let income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ success: false, error: 'No income found' });
        }

        if (income.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        income = await Income.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: income });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete income
// @route   DELETE /api/incomes/:id
// @access  Private
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ success: false, error: 'No income found' });
        }

        if (income.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await income.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
