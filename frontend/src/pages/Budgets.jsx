import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../store/slices/appSlice';
import BudgetProgress from '../components/BudgetProgress';
import BudgetSettingsModal from '../components/BudgetSettingsModal';
import Modal from '../components/Modal';

const Budgets = () => {
    const dispatch = useDispatch();
    const { dashboardData, loading } = useSelector(state => state.app);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    if (loading || !dashboardData) {
        return (
            <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 100px)' }}>
                <div className="loader"></div>
            </div>
        );
    }

    const { budget, currentMonthCategoryExpenses, currentMonthTotal } = dashboardData;

    const handleBudgetSaved = () => {
        setIsBudgetModalOpen(false);
        dispatch(fetchDashboardData());
    };

    return (
        <div className="animate-fade-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Budgets</h1>
                    <p className="text-muted">Manage your spending limits</p>
                </div>
                <button onClick={() => setIsBudgetModalOpen(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Set Budget</button>
            </div>

            {(!budget || (budget.monthlyBudget === 0 && (!budget.categoryBudgets || budget.categoryBudgets.length === 0))) ? (
                <div className="card text-center text-muted" style={{ padding: '3rem' }}>
                    <p>You have not set any budgets yet.</p>
                    <button onClick={() => setIsBudgetModalOpen(true)} className="btn" style={{ marginTop: '1rem', border: '1px solid var(--border)' }}>Create Budget Tracker</button>
                </div>
            ) : (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 className="mb-4 text-muted">Budget Overview</h3>
                    {budget.monthlyBudget > 0 && (
                        <BudgetProgress title="Overall Monthly Budget" spent={currentMonthTotal || 0} limit={budget.monthlyBudget} />
                    )}
                    {budget.categoryBudgets && budget.categoryBudgets.map((cb, idx) => (
                        <BudgetProgress 
                            key={idx} 
                            title={`${cb.category} Budget`} 
                            spent={currentMonthCategoryExpenses?.[cb.category] || 0} 
                            limit={cb.amount} 
                        />
                    ))}
                </div>
            )}

            <Modal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                title="Set Budgets"
            >
                <BudgetSettingsModal currentBudget={budget} onClose={() => setIsBudgetModalOpen(false)} onSaved={handleBudgetSaved} />
            </Modal>
        </div>
    );
};

export default Budgets;
