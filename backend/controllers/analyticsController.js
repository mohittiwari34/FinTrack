const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all incomes and expenses for the user
        const incomes = await Income.find({ userId });
        const expenses = await Expense.find({ userId });
        const budget = await Budget.findOne({ userId });

        // Calculate totals
        const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const currentBalance = totalIncome - totalExpenses;

        // Get recent transactions (combine and sort)
        const recentTransactions = [...incomes, ...expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(t => ({
                id: t._id,
                type: t.source ? 'income' : 'expense',
                amount: t.amount,
                category: t.category || t.source, // Map source to category for income
                date: t.date,
                note: t.note || ''
            }));

        // Prepare chart data: Monthly expenses
        const monthlyExpenses = {};
        expenses.forEach(expense => {
            const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyExpenses[month] = (monthlyExpenses[month] || 0) + expense.amount;
        });

        const monthlyExpenseChart = Object.keys(monthlyExpenses).map(month => ({
            month,
            amount: monthlyExpenses[month]
        }));

        // Prepare chart data: Category-wise expenses
        const categoryExpenses = {};
        expenses.forEach(expense => {
            categoryExpenses[expense.category] = (categoryExpenses[expense.category] || 0) + expense.amount;
        });

        const categoryChart = Object.keys(categoryExpenses).map(category => ({
            name: category,
            value: categoryExpenses[category]
        }));

        // Calculate Insights
        const now = new Date();
        const currentMonthExpenses = expenses.filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const lastMonthExpenses = expenses.filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === (now.getMonth() === 0 ? 11 : now.getMonth() - 1) &&
                   d.getFullYear() === (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
        });

        const currentMonthTotal = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
        const lastMonthTotal = lastMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

        let expenseIncrease = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

        const highestSpendingCategory = Object.keys(categoryExpenses).length > 0
            ? Object.keys(categoryExpenses).reduce((a, b) => categoryExpenses[a] > categoryExpenses[b] ? a : b)
            : 'None';

        const dailyAverageSpending = currentMonthTotal / (now.getDate() || 1);

        const currentMonthCategoryExpenses = {};
        currentMonthExpenses.forEach(expense => {
            currentMonthCategoryExpenses[expense.category] = (currentMonthCategoryExpenses[expense.category] || 0) + expense.amount;
        });

        // Calculate Budget Alerts
        const alerts = [];
        if (budget) {
            if (budget.monthlyBudget > 0) {
                const percentUsed = (currentMonthTotal / budget.monthlyBudget) * 100;
                if (percentUsed >= 100) {
                    alerts.push({ type: 'danger', message: `Monthly budget exceeded! You spent ₹${currentMonthTotal} / ₹${budget.monthlyBudget}.` });
                } else if (percentUsed >= 80) {
                    alerts.push({ type: 'warning', message: `You have used ${percentUsed.toFixed(0)}% of your monthly budget (₹${currentMonthTotal} / ₹${budget.monthlyBudget}).` });
                }
            }

            if (budget.categoryBudgets && budget.categoryBudgets.length > 0) {
                budget.categoryBudgets.forEach(cb => {
                    const spent = currentMonthCategoryExpenses[cb.category] || 0;
                    if (cb.amount > 0) {
                        const percentUsed = (spent / cb.amount) * 100;
                        if (percentUsed >= 100) {
                            alerts.push({ type: 'danger', message: `Budget exceeded for ${cb.category}! You spent ₹${spent} / ₹${cb.amount}.` });
                        } else if (percentUsed >= 80) {
                            alerts.push({ type: 'warning', message: `${cb.category} budget at ${percentUsed.toFixed(0)}% (₹${spent} / ₹${cb.amount}).` });
                        }
                    }
                });
            }
        }

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                currentBalance,
                recentTransactions,
                monthlyExpenseChart,
                categoryChart,
                expenseIncrease,
                highestSpendingCategory,
                dailyAverageSpending,
                currentMonthCategoryExpenses,
                currentMonthTotal,
                budget,
                alerts
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
