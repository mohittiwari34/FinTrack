import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import { Wallet, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { error, actionLoading: isSubmitting } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="auth-container">
            <div className="auth-card card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                        <Wallet size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p className="text-muted">Sign in to manage your expenses</p>
                </div>

                {error && (
                    <div className="badge badge-expense mb-4 w-full" style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {error}
                        <button onClick={() => dispatch(clearError())} style={{ float: 'right', color: 'inherit' }}>&times;</button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full justify-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <span className="loader" style={{ width: 16, height: 16, borderTopColor: 'white' }}></span> : <><LogIn size={18} /> Sign In</>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
