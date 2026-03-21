const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    source: {
        type: String,
        required: [true, 'Please add a source'],
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);
