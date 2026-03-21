import React from 'react';

const BudgetProgress = ({ title, spent, limit }) => {
    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    
    let colorClass = 'var(--success)';
    if (percentage >= 100) {
        colorClass = 'var(--danger)';
    } else if (percentage >= 80) {
        colorClass = 'var(--warning)';
    }

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
                <span className="text-muted" style={{ fontWeight: 500 }}>{title}</span>
                <span className="text-muted">₹{spent} / ₹{limit} used</span>
            </div>
            <div style={{ width: '100%', backgroundColor: 'var(--surface-hover)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div 
                    style={{ 
                        height: '100%', 
                        backgroundColor: colorClass, 
                        width: `${percentage}%`,
                        transition: 'width 0.3s ease'
                    }} 
                />
            </div>
        </div>
    );
};

export default BudgetProgress;
