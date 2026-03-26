import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../store/slices/appSlice';
import { Activity, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { NetFlowChart, CategoryPieChart } from '../components/DashboardCharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Analytics = () => {
    const dispatch = useDispatch();
    const { dashboardData, loading, expenses, incomes } = useSelector(state => state.app);

    const getCombinedTransactions = () => {
        const mappedExpenses = (expenses || []).map(e => ({ ...e, type: 'Expense', cName: e.category }));
        const mappedIncomes = (incomes || []).map(i => ({ ...i, type: 'Income', cName: i.source }));
        return [...mappedExpenses, ...mappedIncomes].sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const downloadCSV = () => {
        const allTransactions = getCombinedTransactions();
        const headers = ["Date", "Type", "Category/Source", "Note", "Amount"];
        const rows = allTransactions.map(tx => [
            new Date(tx.date).toLocaleDateString(),
            tx.type,
            tx.cName,
            `"${(tx.note || '').replace(/"/g, '""')}"`,
            tx.amount
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Transactions_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Monthly Financial Report", 14, 22);
        
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        
        const allTransactions = getCombinedTransactions();
        const tableColumn = ["Date", "Type", "Category/Source", "Note", "Amount"];
        const tableRows = [];

        allTransactions.forEach(tx => {
            const txData = [
                new Date(tx.date).toLocaleDateString(),
                tx.type,
                tx.cName,
                tx.note || '-',
                `Rs ${tx.amount.toFixed(2)}`
            ];
            tableRows.push(txData);
        });

        autoTable(doc, {
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [52, 211, 153] },
        });

        doc.save(`Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

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
                
                {/* Export & Reports Card */}
                <div className="card" style={{ gridColumn: '1 / -1', background: 'var(--primary-gradient)', color: 'white' }}>
                    <h3 className="mb-4 flex items-center gap-2 text-white"><Download size={20} /> Export & Reports</h3>
                    <p className="mb-6 opacity-90" style={{ fontSize: '0.9rem' }}>
                        Download a complete history of all your transactions for accounting and tax purposes. 
                        Currently displaying <strong>{(expenses?.length || 0) + (incomes?.length || 0)}</strong> total records.
                    </p>
                    
                    <div className="flex gap-4 flex-wrap">
                        <button 
                            onClick={downloadCSV}
                            className="btn flex items-center gap-2" 
                            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
                        >
                            <FileSpreadsheet size={18} /> Download CSV
                        </button>
                        <button 
                            onClick={downloadPDF}
                            className="btn flex items-center gap-2" 
                            style={{ background: 'white', color: 'var(--primary)', border: '1px solid white' }}
                        >
                            <FileText size={18} /> Download PDF Monthly Report
                        </button>
                    </div>
                </div>

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
