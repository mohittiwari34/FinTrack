import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../store/slices/appSlice';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Calendar, PiggyBank, Activity } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import { NetFlowChart } from '../components/DashboardCharts';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { dashboardData, loading } = useSelector(state => state.app);
    const { user } = useSelector(state => state.auth);

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

    const { 
        totalIncome, totalExpenses, currentBalance,
        expenseIncrease, highestSpendingCategory, dailyAverageSpending, alerts,
        currentMonthSavings, topExpensesThisMonth, netFlowChart, recentTransactions
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
                <SummaryCard 
                    title="Savings This Month" 
                    amount={currentMonthSavings} 
                    icon={PiggyBank} 
                    type={currentMonthSavings >= 0 ? 'income' : 'expense'} 
                    insight={currentMonthSavings >= 0 ? 'On track!' : 'Spending exceeds income'} 
                />
                <SummaryCard title="Highest Spending Category" value={highestSpendingCategory} icon={TrendingUp} type="expense" />
                <SummaryCard title="Daily Avg Spending" amount={dailyAverageSpending} icon={Calendar} type="balance" />
            </div>

            {/* Net Flow Chart Full Width */}
            <div className="card mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-muted"><Activity size={18} /> Net Flow Overview</h3>
                <NetFlowChart data={netFlowChart} />
            </div>

            {/* Data Tables Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                
                {/* Recent Transactions */}
                <div className="card" style={{ padding: '1.5rem 0' }}>
                    <h3 className="mb-4 text-muted" style={{ padding: '0 1.5rem' }}>Recent Transactions</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {recentTransactions && recentTransactions.map((tx) => (
                                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem 1.5rem' }} className="text-muted">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '0.75rem 1.5rem' }}>
                                            <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                                            ₹{tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {(!recentTransactions || recentTransactions.length === 0) && (
                                    <tr><td colSpan="3" className="text-center text-muted py-4">No recent transactions</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top 5 Expenses */}
                <div className="card" style={{ padding: '1.5rem 0' }}>
                    <h3 className="mb-4 text-muted" style={{ padding: '0 1.5rem' }}>Top 5 Expenses This Month</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {topExpensesThisMonth && topExpensesThisMonth.map((tx) => (
                                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem 1.5rem' }} className="text-muted">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '0.75rem 1.5rem' }}>
                                            <span className="badge badge-expense">{tx.category}</span>
                                        </td>
                                        <td style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--danger)' }}>
                                            ₹{tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {(!topExpensesThisMonth || topExpensesThisMonth.length === 0) && (
                                    <tr><td colSpan="3" className="text-center text-muted py-4">No expenses this month</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
