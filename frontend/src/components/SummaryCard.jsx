const SummaryCard = ({ title, amount, icon: Icon, type, insight, value }) => {
    const getColorStyle = () => {
        switch (type) {
            case 'income': return { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' };
            case 'expense': return { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' };
            case 'balance': return { color: 'var(--primary)', bg: 'rgba(99, 102, 241, 0.1)' };
            default: return { color: 'var(--text)', bg: 'var(--surface-hover)' };
        }
    };

    const styles = getColorStyle();

    return (
        <div className="card flex items-center gap-4">
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: styles.bg,
                    color: styles.color
                }}
            >
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{title}</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                    {value ? value : `₹${amount ? amount.toFixed(2) : '0.00'}`}
                </p>
                {insight && (
                    <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: insight.includes('more') || insight.includes('Increase') ? 'var(--danger)' : 'var(--success)' }}>
                        {insight}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SummaryCard;
