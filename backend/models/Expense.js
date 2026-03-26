const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Food', 'Travel', 'Shopping', 'Bills', 'Other'],
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        required: [true, 'Please select a payment method'],
        enum: ['Cash', 'Card', 'UPI'],
    },
    receiptUrl: {
        type: String,
        default: null
    },
    note: {
        type: String,
        maxlength: [200, 'Note cannot be more than 200 characters'],
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringInterval: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', null],
        default: null
    },
    nextRecurringDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
