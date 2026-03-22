const cron = require('node-cron');
const Expense = require('../models/Expense');

// Run every midnight: '0 0 * * *'
// We will also allow running manually for testing
const startRecurringJob = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running recurring expenses cron job...');
        try {
            const now = new Date();
            // Find expenses marked as recurring where the next date has arrived
            const dueExpenses = await Expense.find({
                isRecurring: true,
                nextRecurringDate: { $lte: now }
            });

            for (let expense of dueExpenses) {
                console.log(`Duplicating expense: ${expense.category} - ${expense.amount}`);
                
                // 1. Create a clone entry for today
                await Expense.create({
                    userId: expense.userId,
                    amount: expense.amount,
                    category: expense.category,
                    date: now,
                    paymentMethod: expense.paymentMethod,
                    note: expense.note,
                    isRecurring: false, // The clone itself shouldn't spawn children
                });

                // 2. Advance the nextRecurringDate on the template
                const nextDate = new Date(expense.nextRecurringDate);
                if (expense.recurringInterval === 'daily') {
                    nextDate.setDate(nextDate.getDate() + 1);
                } else if (expense.recurringInterval === 'weekly') {
                    nextDate.setDate(nextDate.getDate() + 7);
                } else if (expense.recurringInterval === 'monthly') {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                }

                expense.nextRecurringDate = nextDate;
                await expense.save();
            }
        } catch (error) {
            console.error('Error running recurring cron job:', error);
        }
    });
};

module.exports = startRecurringJob;
