import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/slices/appSlice';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import IncomeForm from '../components/IncomeForm';
import ExpenseList from '../components/ExpenseList';
import QuickAdd from '../components/QuickAdd';

const Transactions = () => {
    const dispatch = useDispatch();
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

    useEffect(() => {
        // Just fetch fresh data when trans page loads
        dispatch(fetchDashboardData());
    }, [dispatch]);

    const handleExpenseAdded = () => {
        setIsExpenseModalOpen(false);
        dispatch(fetchDashboardData());
    };

    const handleIncomeAdded = () => {
        setIsIncomeModalOpen(false);
        dispatch(fetchDashboardData());
    };

    return (
        <div className="animate-fade-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Transactions</h1>
                    <p className="text-muted">Manage all your incomes and expenses</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsExpenseModalOpen(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Add Expense</button>
                    <button onClick={() => setIsIncomeModalOpen(true)} className="btn" style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>+ Add Income</button>
                </div>
            </div>

            <QuickAdd />

            <ExpenseList />

            <Modal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                title="Add New Expense"
            >
                <ExpenseForm onClose={handleExpenseAdded} />
            </Modal>

            <Modal
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                title="Add New Income"
            >
                <IncomeForm onClose={handleIncomeAdded} />
            </Modal>
        </div>
    );
};

export default Transactions;
