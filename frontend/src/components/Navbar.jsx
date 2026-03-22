import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <nav style={{
            background: 'var(--surface)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border)',
            padding: '0.75rem 2rem',
            position: 'sticky',
            top: '1rem',
            zIndex: 50,
            boxShadow: 'var(--shadow)',
            borderRadius: 'var(--radius-lg)',
            width: '95%',
            maxWidth: '1200px',
            margin: '1rem auto'
        }}>
            <div className="main-content" style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.25rem' }}>
                    <Wallet size={24} />
                    <span>FinTrack</span>
                </Link>

                <div className="flex gap-4 items-center" style={{ fontWeight: 500 }}>
                    <Link to="/" className="nav-link">Dashboard</Link>
                    <Link to="/transactions" className="nav-link">Transactions</Link>
                    <Link to="/budgets" className="nav-link">Budgets</Link>
                    <Link to="/analytics" className="nav-link">Analytics</Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 badge">
                        <User size={14} />
                        <span>{user.name}</span>
                    </div>

                    <button
                        onClick={logout}
                        className="btn btn-ghost flex items-center gap-2"
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
