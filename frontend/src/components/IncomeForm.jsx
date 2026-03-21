import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const IncomeForm = ({ onClose }) => {
    const { addIncome, error, setError } = useContext(AppContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        amount: '',
        source: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Ensure amount is a number
        const submitData = {
            ...formData,
            amount: Number(formData.amount)
        };

        const success = await addIncome(submitData);
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

            <div className="form-group">
                <label className="form-label">Source / Origin</label>
                <input
                    type="text"
                    name="source"
                    className="form-control"
                    placeholder="e.g. Salary, Freelance, Investment"
                    value={formData.source}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group mb-6">
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

            <div className="flex justify-between gap-4">
                <button type="button" className="btn btn-ghost w-full" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full justify-center" style={{ backgroundColor: 'var(--success)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }} disabled={isSubmitting}>
                    {isSubmitting ? <span className="loader" style={{ width: 16, height: 16, borderTopColor: 'white' }}></span> : 'Save Income'}
                </button>
            </div>
        </form>
    );
};

export default IncomeForm;
