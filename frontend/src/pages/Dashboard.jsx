import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Calendar } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';

const Dashboard = () => {
    const { dashboardData, loading, fetchDashboardData } = useContext(AppContext);
    const { user } = useContext(AuthContext);

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
        totalIncome, totalExpenses, currentBalance,
        expenseIncrease, highestSpendingCategory, dailyAverageSpending, alerts 
    } = dashboardData;

    const expenseInsight = typeof expenseIncrease === 'number' && expenseIncrease > 0 
        ? `You spent ${expenseIncrease.toFixed(0)}% more than last month` 
        : typeof expenseIncrease === 'number' && expenseIncrease < 0 
        ? `You spent ${Math.abs(expenseIncrease).toFixed(0)}% less than last month` 
        : `Same spending as last month`;

    return (
        <div className="animate-fade-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Dashboard Overview</h1>
                    <p className="text-muted">Welcome back, {user?.name}</p>
                </div>
            </div>

            {/* High Priority Alerts Only */}
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

            {/* Executive Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <SummaryCard title="Total Balance" amount={currentBalance} icon={Wallet} type="balance" />
                <SummaryCard title="Total Income" amount={totalIncome} icon={ArrowDownRight} type="income" />
                <SummaryCard title="Total Expenses" amount={totalExpenses} icon={ArrowUpRight} type="expense" insight={expenseInsight} />
            </div>

            {/* Smart Insight Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <SummaryCard title="Highest Spending Category" value={highestSpendingCategory} icon={TrendingUp} type="expense" />
                <SummaryCard title="Daily Avg Spending" amount={dailyAverageSpending} icon={Calendar} type="balance" />
            </div>
        </div>
    );
};

export default Dashboard;
