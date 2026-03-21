import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, TrendingUp, Calendar } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import { ExpenseBarChart, CategoryPieChart } from '../components/DashboardCharts';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import IncomeForm from '../components/IncomeForm';
import ExpenseList from '../components/ExpenseList';
import BudgetProgress from '../components/BudgetProgress';
import BudgetSettingsModal from '../components/BudgetSettingsModal';

const Dashboard = () => {
    const { dashboardData, loading, fetchDashboardData } = useContext(AppContext);
    const { user } = useContext(AuthContext);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading || !dashboardData) {
        return (
            <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 100px)' }}>
                <div className="loader"></div>
            </div>
        );
    }

    const { 
        totalIncome, totalExpenses, currentBalance, recentTransactions, 
        monthlyExpenseChart, categoryChart, expenseIncrease, 
        highestSpendingCategory, dailyAverageSpending,
        budget, alerts, currentMonthCategoryExpenses, currentMonthTotal 
    } = dashboardData;

    const expenseInsight = typeof expenseIncrease === 'number' && expenseIncrease > 0 
        ? `You spent ${expenseIncrease.toFixed(0)}% more than last month` 
        : typeof expenseIncrease === 'number' && expenseIncrease < 0 
        ? `You spent ${Math.abs(expenseIncrease).toFixed(0)}% less than last month` 
        : `Same spending as last month`;

    const handleExpenseAdded = () => {
        setIsExpenseModalOpen(false);
        fetchDashboardData();
    };

    const handleIncomeAdded = () => {
        setIsIncomeModalOpen(false);
        fetchDashboardData();
    };

    const handleBudgetSaved = () => {
        setIsBudgetModalOpen(false);
        fetchDashboardData();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Dashboard</h1>
                    <p className="text-muted">Welcome back, {user?.name}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsBudgetModalOpen(true)} className="btn" style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>Set Budget</button>
                    <button onClick={() => setIsExpenseModalOpen(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Add Expense</button>
                    <button onClick={() => setIsIncomeModalOpen(true)} className="btn" style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>+ Add Income</button>
                </div>
            </div>

            {/* Alerts */}
            {alerts && alerts.map((alert, idx) => (
                <div key={idx} className="alert" style={{ 
                    padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', 
                    backgroundColor: alert.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                    color: alert.type === 'danger' ? 'var(--danger)' : 'var(--warning)', 
                    border: `1px solid ${alert.type === 'danger' ? 'var(--danger)' : 'var(--warning)'}` 
                }}>
                    <strong>{alert.type === 'danger' ? 'Alert: ' : 'Warning: '}</strong>{alert.message}
                </div>
            ))}

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <SummaryCard title="Total Balance" amount={currentBalance} icon={Wallet} type="balance" />
                <SummaryCard title="Total Income" amount={totalIncome} icon={ArrowDownRight} type="income" />
                <SummaryCard title="Total Expenses" amount={totalExpenses} icon={ArrowUpRight} type="expense" insight={expenseInsight} />
            </div>

            {/* Budget Progress Box */}
            {budget && (budget.monthlyBudget > 0 || (budget.categoryBudgets && budget.categoryBudgets.length > 0)) && (
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

            {/* Insight Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <SummaryCard title="Highest Spending Category" value={highestSpendingCategory} icon={TrendingUp} type="expense" />
                <SummaryCard title="Daily Avg Spending" amount={dailyAverageSpending} icon={Calendar} type="balance" />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 className="mb-4 flex items-center gap-2 text-muted"><Activity size={18} /> Monthly Expenses Overview</h3>
                    <ExpenseBarChart data={monthlyExpenseChart} />
                </div>
                <div className="card">
                    <h3 className="mb-4 text-muted">Expenses by Category</h3>
                    <CategoryPieChart data={categoryChart} />
                </div>
            </div>

            {/* Expense & Income List (replaces static recent transactions) */}
            <h3 className="mb-4 mt-8 text-muted">Transaction History</h3>
            <ExpenseList />
            {/* Modals */}
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

export default Dashboard;
