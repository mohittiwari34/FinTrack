const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    monthlyBudget: {
        type: Number,
        default: 0
    },
    categoryBudgets: [{
        category: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);
