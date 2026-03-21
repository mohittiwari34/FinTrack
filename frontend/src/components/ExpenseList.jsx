import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, Edit2, Search } from 'lucide-react';
import Modal from './Modal';

const ExpenseList = () => {
    const { expenses, incomes, fetchExpenses, fetchIncomes, deleteExpense, updateExpense } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'incomes'
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        fetchExpenses();
        fetchIncomes();
    }, [fetchExpenses, fetchIncomes]);

    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setIsEditModalOpen(true);
    };

    const handleUpdateExpense = async (e) => {
        e.preventDefault();
        const success = await updateExpense(editingExpense._id, editingExpense);
        if (success) {
            setIsEditModalOpen(false);
            setEditingExpense(null);
        }
    };

    const handleDelete = async (id, type) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            if (type === 'expense') {
                await deleteExpense(id);
            }
            // For future: await deleteIncome(id);
        }
    };

    const dataToDisplay = activeTab === 'expenses' ? expenses : incomes;

    const filteredData = dataToDisplay.filter(item => {
        const matchesSearch = (item.note || item.source || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' ? true : (item.category === categoryFilter);
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="card mt-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <button
                        className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab('expenses')}
                    >
                        Expenses
                    </button>
                    <button
                        className={`btn ${activeTab === 'incomes' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab('incomes')}
                    >
                        Incomes
                    </button>
                </div>

                <div className="flex gap-4">
                    {activeTab === 'expenses' && (
                        <select
                            className="form-control"
                            style={{ width: 'auto', padding: '0.5rem' }}
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                            <option value="Other">Other</option>
                        </select>
                    )}
                    <div className="relative flex items-center">
                        <Search size={16} className="text-muted absolute left-3" />
                        <input
                            type="text"
                            className="form-control pl-10"
                            placeholder="Search notes..."
                            style={{ paddingLeft: '2.5rem', padding: '0.5rem 0.5rem 0.5rem 2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>{activeTab === 'expenses' ? 'Category' : 'Source'}</th>
                            <th>Notes</th>
                            <th>Method</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item._id}>
                                <td className="text-muted">{new Date(item.date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${activeTab === 'incomes' ? 'badge-income' : 'badge-expense'}`}>
                                        {item.category || item.source}
                                    </span>
                                </td>
                                <td className="text-muted">{item.note || '-'}</td>
                                <td>{item.paymentMethod || '-'}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600, color: activeTab === 'incomes' ? 'var(--success)' : 'var(--danger)' }}>
                                    ₹{item.amount.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="flex justify-center gap-2">
                                        {activeTab === 'expenses' && (
                                            <button onClick={() => handleEditClick(item)} className="btn-ghost" style={{ padding: '0.25rem', color: 'var(--primary)' }}>
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(item._id, activeTab === 'expenses' ? 'expense' : 'income')} className="btn-ghost" style={{ padding: '0.25rem', color: 'var(--danger)' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }} className="text-muted">
                                    No {activeTab} found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Expense">
                {editingExpense && (
                    <form onSubmit={handleUpdateExpense}>
                        <div className="form-group">
                            <label className="form-label">Amount (₹)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={editingExpense.amount}
                                onChange={(e) => setEditingExpense({ ...editingExpense, amount: Number(e.target.value) })}
                                required min="0.01" step="0.01"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="form-group w-full">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-control"
                                    value={editingExpense.category}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                                >
                                    {['Food', 'Travel', 'Shopping', 'Bills', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group w-full">
                                <label className="form-label">Method</label>
                                <select
                                    className="form-control"
                                    value={editingExpense.paymentMethod}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, paymentMethod: e.target.value })}
                                >
                                    {['Cash', 'Card', 'UPI'].map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-group mb-6">
                            <label className="form-label">Notes</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editingExpense.note || ''}
                                onChange={(e) => setEditingExpense({ ...editingExpense, note: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default ExpenseList;
