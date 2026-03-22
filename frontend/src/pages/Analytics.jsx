import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Activity } from 'lucide-react';
import { NetFlowChart, CategoryPieChart } from '../components/DashboardCharts';

const Analytics = () => {
    const { dashboardData, loading, fetchDashboardData } = useContext(AppContext);

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

    const { netFlowChart, categoryChart } = dashboardData;

    return (
        <div className="animate-fade-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Analytics</h1>
                    <p className="text-muted">Deep dive into your spending habits</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 className="mb-4 flex items-center gap-2 text-muted"><Activity size={18} /> Net Flow (Income vs Expense)</h3>
                    <NetFlowChart data={netFlowChart} />
                </div>
                <div className="card">
                    <h3 className="mb-4 text-muted">Expenses by Category</h3>
                    <CategoryPieChart data={categoryChart} />
                </div>
            </div>
        </div>
    );
};

export default Analytics;
