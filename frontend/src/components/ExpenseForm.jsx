import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Card', 'UPI'];

const ExpenseForm = ({ onClose }) => {
    const { addExpense, error, setError } = useContext(AppContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        amount: '',
        category: CATEGORIES[0],
        date: new Date().toISOString().split('T')[0],
        paymentMethod: PAYMENT_METHODS[0],
        note: '',
        isRecurring: false,
        recurringInterval: 'monthly'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Ensure amount is a number
        const submitData = {
            ...formData,
            amount: Number(formData.amount)
        };

        const success = await addExpense(submitData);
        if (success) {
            onClose();
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="badge badge-expense mb-4 w-full" style={{ padding: '0.5rem', textAlign: 'center' }}>
                    {error}
                    <button type="button" onClick={() => setError(null)} style={{ float: 'right', color: 'inherit' }}>&times;</button>
                </div>
            )}

            <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                    type="number"
                    name="amount"
                    className="form-control"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                />
            </div>

            <div className="flex gap-4">
                <div className="form-group w-full">
                    <label className="form-label">Category</label>
                    <select
                        name="category"
                        className="form-control"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div className="form-group w-full">
                    <label className="form-label">Payment Method</label>
                    <select
                        name="paymentMethod"
                        className="form-control"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        required
                    >
                        {PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex gap-4 mb-4 items-center">
                <div className="form-group flex items-center gap-2" style={{ marginBottom: 0 }}>
                    <input
                        type="checkbox"
                        name="isRecurring"
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onChange={handleChange}
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                    />
                    <label htmlFor="isRecurring" style={{ cursor: 'pointer', margin: 0, fontWeight: 500 }} className="text-muted">Set as Recurring</label>
                </div>
                {formData.isRecurring && (
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                        <select
                            name="recurringInterval"
                            className="form-control"
                            value={formData.recurringInterval}
                            onChange={handleChange}
                            required
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label className="form-label">Date</label>
                <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group mb-6">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                    name="note"
                    className="form-control"
                    placeholder="What was this for?"
                    value={formData.note}
                    onChange={handleChange}
                    rows="3"
                    maxLength="200"
                ></textarea>
            </div>

            <div className="flex justify-between gap-4">
                <button type="button" className="btn btn-ghost w-full" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full justify-center" disabled={isSubmitting}>
                    {isSubmitting ? <span className="loader" style={{ width: 16, height: 16, borderTopColor: 'white' }}></span> : 'Save Expense'}
                </button>
            </div>
        </form>
    );
};

export default ExpenseForm;
