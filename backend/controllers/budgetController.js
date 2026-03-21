const Budget = require('../models/Budget');

// @desc    Get user budget
// @route   GET /api/budgets
// @access  Private
exports.getBudget = async (req, res) => {
    try {
        let budget = await Budget.findOne({ userId: req.user.id });
        if (!budget) {
            // Create default budget if none exists
            budget = await Budget.create({ userId: req.user.id, monthlyBudget: 0, categoryBudgets: [] });
        }
        res.status(200).json({ success: true, data: budget });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update user budget
// @route   PUT /api/budgets
// @access  Private
exports.updateBudget = async (req, res) => {
    try {
        const { monthlyBudget, categoryBudgets } = req.body;
        let budget = await Budget.findOne({ userId: req.user.id });

        if (budget) {
            budget.monthlyBudget = monthlyBudget !== undefined ? monthlyBudget : budget.monthlyBudget;
            budget.categoryBudgets = categoryBudgets !== undefined ? categoryBudgets : budget.categoryBudgets;
            await budget.save();
        } else {
            budget = await Budget.create({
                userId: req.user.id,
                monthlyBudget: monthlyBudget || 0,
                categoryBudgets: categoryBudgets || []
            });
        }

        res.status(200).json({ success: true, data: budget });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
