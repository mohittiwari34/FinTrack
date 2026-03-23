import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, Edit2, Search, FilterX, SlidersHorizontal } from 'lucide-react';
import Modal from './Modal';

const ExpenseList = () => {
    const { expenses, incomes, fetchExpenses, fetchIncomes, deleteExpense, updateExpense } = useContext(AppContext);
    
    // Core State
    const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'incomes'
    const [isFiltersOpen, setIsFiltersOpen] = useState(false); // Toggle advanced filters

    // Filter & Sort States
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [sortBy, setSortBy] = useState('latest');

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
            // Add deleteIncome here when ready
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('All');
        setStartDate('');
        setEndDate('');
        setMinAmount('');
        setMaxAmount('');
        setSortBy('latest');
    };

    const dataToDisplay = activeTab === 'expenses' ? expenses : incomes;

    // Filter Logic
    let processedData = dataToDisplay.filter(item => {
        const text = (item.note || item.source || '').toLowerCase();
        const cat = item.category || item.source || '';
        
        const matchesSearch = text.includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' ? true : (cat === categoryFilter);
        
        const itemDate = new Date(item.date);
        const matchesStartDate = startDate ? itemDate >= new Date(startDate) : true;
        const matchesEndDate = endDate ? itemDate <= new Date(endDate + 'T23:59:59') : true;
        
        const matchesMinAmount = minAmount ? item.amount >= Number(minAmount) : true;
        const matchesMaxAmount = maxAmount ? item.amount <= Number(maxAmount) : true;

        return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate && matchesMinAmount && matchesMaxAmount;
    });

    // Sorting Logic
    processedData.sort((a, b) => {
        if (sortBy === 'latest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'highest') return b.amount - a.amount;
        if (sortBy === 'lowest') return a.amount - b.amount;
        return 0;
    });

    return (
        <div className="card mt-4">
            {/* Top Bar: Tabs & Quick Actions */}
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <div className="flex gap-2 p-1 badge" style={{ background: 'var(--background)' }}>
                    <button
                        className="btn"
                        style={{ padding: '0.4rem 1rem', background: activeTab === 'expenses' ? 'var(--primary)' : 'transparent', color: activeTab === 'expenses' ? 'white' : 'var(--text-muted)', boxShadow: activeTab === 'expenses' ? 'var(--shadow)' : 'none' }}
                        onClick={() => { setActiveTab('expenses'); clearFilters(); }}
                    >
                        Expenses
                    </button>
                    <button
                        className="btn"
                        style={{ padding: '0.4rem 1rem', background: activeTab === 'incomes' ? 'var(--success)' : 'transparent', color: activeTab === 'incomes' ? 'white' : 'var(--text-muted)', boxShadow: activeTab === 'incomes' ? 'var(--shadow)' : 'none' }}
                        onClick={() => { setActiveTab('incomes'); clearFilters(); }}
                    >
                        Incomes
                    </button>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="relative flex items-center">
                        <Search size={16} className="text-muted absolute left-3" />
                        <input
                            type="text"
                            className="form-control pl-10"
                            placeholder="Search notes..."
                            style={{ paddingLeft: '2.5rem', padding: '0.5rem 0.5rem 0.5rem 2.5rem', minWidth: '220px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)} 
                        className={`btn btn-ghost flex items-center gap-2 ${isFiltersOpen ? 'text-primary' : ''}`}
                        title="Advanced Filters"
                    >
                        <SlidersHorizontal size={18} />
                        Filter & Sort
                    </button>
                </div>
            </div>

            {/* Advanced Filters Panel (Collapsible) */}
            {isFiltersOpen && (
                <div className="mb-6 p-4 border border-[var(--border)] rounded-md" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        
                        {/* Sort */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Sort By</label>
                            <select className="form-control" style={{ padding: '0.5rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="highest">Highest Amount</option>
                                <option value="lowest">Lowest Amount</option>
                            </select>
                        </div>

                        {/* Category (Expense only) */}
                        {activeTab === 'expenses' && (
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Category</label>
                                <select className="form-control" style={{ padding: '0.5rem' }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                    <option value="All">All Categories</option>
                                    {['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Drinks', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Amount Range */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Min Amount (₹)</label>
                            <input type="number" className="form-control" style={{ padding: '0.5rem' }} placeholder="0" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Max Amount (₹)</label>
                            <input type="number" className="form-control" style={{ padding: '0.5rem' }} placeholder="No max" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
                        </div>

                        {/* Date Range */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Start Date</label>
                            <input type="date" className="form-control" style={{ padding: '0.5rem' }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>End Date</label>
                            <input type="date" className="form-control" style={{ padding: '0.5rem' }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <button onClick={clearFilters} className="btn text-muted flex items-center gap-2 hover:text-white" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                            <FilterX size={16} /> Clear All Filters
                        </button>
                    </div>
                </div>
            )}

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
                        {processedData.map((item) => (
                            <tr key={item._id}>
                                <td className="text-muted">{new Date(item.date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${activeTab === 'incomes' ? 'badge-income' : 'badge-expense'}`}>
                                        {item.category || item.source}
                                    </span>
                                </td>
                                <td className="text-muted">{item.note || '-'}</td>
                                <td>{item.paymentMethod || '-'}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600, color: activeTab === 'incomes' ? '#34d399' : '#fca5a5' }}>
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
                        {processedData.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }} className="text-muted">
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
                                    {['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Drinks', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
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
