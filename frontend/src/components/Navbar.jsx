import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <nav style={{
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: 'var(--shadow)'
        }}>
            <div className="main-content" style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.25rem' }}>
                    <Wallet size={24} />
                    <span>FinTrack</span>
                </Link>

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
