import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDetails, updatePassword, clearError } from '../store/slices/authSlice';
import { User, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, actionLoading, error } = useSelector(state => state.auth);

    const [details, setDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState(null);

    const handleDetailsUpdate = async (e) => {
        e.preventDefault();
        setMessage(null);
        dispatch(clearError());
        
        try {
            await dispatch(updateDetails(details)).unwrap();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            // Error handled by redux
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage(null);
        dispatch(clearError());

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            await dispatch(updatePassword({ 
                currentPassword: passwords.currentPassword, 
                newPassword: passwords.newPassword 
            })).unwrap();
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            // Error handled by redux
        }
    };

    return (
        <div className="animate-fade-up max-w-4xl mx-auto">
            <h1 className="mb-6" style={{ fontSize: '1.875rem' }}>Profile Settings</h1>

            {message && (
                <div className={`alert mb-6 p-4 rounded-md flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            {error && (
                <div className="alert mb-6 p-4 rounded-md flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account Details */}
                <div className="card">
                    <h3 className="mb-6 flex items-center gap-2">
                        <User size={20} className="text-primary" /> Personal Information
                    </h3>
                    <form onSubmit={handleDetailsUpdate}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <input
                                    type="text"
                                    className="form-control pl-10"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={details.name}
                                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group mb-8">
                            <label className="form-label">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <input
                                    type="email"
                                    className="form-control pl-10"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={details.email}
                                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader2 size={18} className="animate-spin" /> : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Password Change */}
                <div className="card">
                    <h3 className="mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-primary" /> Change Password
                    </h3>
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="form-group mb-8">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-ghost w-full border border-[var(--border)] hover:bg-[var(--border)] flex items-center justify-center gap-2"
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
