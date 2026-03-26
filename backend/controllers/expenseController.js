const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: expenses.length, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res) => {
    try {
        req.body.userId = req.user.id;
        
        if (req.file) {
            req.body.receiptUrl = `/uploads/${req.file.filename}`;
        }
        
        if (req.body.isRecurring && req.body.recurringInterval) {
            const date = new Date(req.body.date || Date.now());
            if (req.body.recurringInterval === 'daily') {
                date.setDate(date.getDate() + 1);
            } else if (req.body.recurringInterval === 'weekly') {
                date.setDate(date.getDate() + 7);
            } else if (req.body.recurringInterval === 'monthly') {
                date.setMonth(date.getMonth() + 1);
            }
            req.body.nextRecurringDate = date;
        }

        const expense = await Expense.create(req.body);
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        } else {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, error: 'No expense found' });
        }

        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await expense.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, error: 'No expense found' });
        }

        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
