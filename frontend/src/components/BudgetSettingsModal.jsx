import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BudgetSettingsModal = ({ currentBudget, onClose, onSaved }) => {
    const [monthlyBudget, setMonthlyBudget] = useState(currentBudget?.monthlyBudget || 0);
    const [categories, setCategories] = useState(currentBudget?.categoryBudgets || []);
    const [newCategory, setNewCategory] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [error, setError] = useState(null);

    const handleAddCategory = () => {
        if (!newCategory || !newAmount) return;
        setCategories([...categories, { category: newCategory, amount: Number(newAmount) }]);
        setNewCategory('');
        setNewAmount('');
    };

    const handleRemoveCategory = (index) => {
        const newCats = [...categories];
        newCats.splice(index, 1);
        setCategories(newCats);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put('/budgets', { monthlyBudget: Number(monthlyBudget), categoryBudgets: categories });
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save budget settings');
        }
    };

    return (
        <form onSubmit={handleSave}>
            {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', color: 'var(--danger)' }}>{error}</div>}
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Overall Monthly Budget (₹)</label>
                <input 
                    type="number" 
                    className="form-control" 
                    value={monthlyBudget} 
                    onChange={(e) => setMonthlyBudget(e.target.value)} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
            </div>

            <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Category Budgets</h4>
                {categories.map((cat, i) => (
                    <div key={i} className="flex justify-between items-center" style={{ padding: '0.5rem', background: 'var(--surface-hover)', marginBottom: '0.5rem', borderRadius: '4px' }}>
                        <span>{cat.category}: ₹{cat.amount}</span>
                        <button type="button" onClick={() => handleRemoveCategory(i)} style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove</button>
                    </div>
                ))}

                <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="Category (e.g. Food)" 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                    />
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={newAmount} 
                        onChange={(e) => setNewAmount(e.target.value)}
                        style={{ width: '100px', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                    />
                    <button type="button" onClick={handleAddCategory} className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>Add</button>
                </div>
            </div>

            <div className="flex justify-end gap-2" style={{ marginTop: '2rem' }}>
                <button type="button" onClick={onClose} className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Budgets</button>
            </div>
        </form>
    );
};

export default BudgetSettingsModal;
