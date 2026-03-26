import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkLoggedIn } from './store/slices/authSlice';
import { fetchDashboardData, fetchExpenses, fetchIncomes } from './store/slices/appSlice';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useSelector(state => state.auth);

    if (loading) return <div className="loader" style={{ margin: '50px auto' }}></div>;

    return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            dispatch(fetchDashboardData());
            dispatch(fetchExpenses());
            dispatch(fetchIncomes());
        }
    }, [user, dispatch]);

    return (
        <Router>
            {user && <Navbar />}
            <div className="app-container">
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
                        <Route
                            path="/"
                            element={<PrivateRoute><Dashboard /></PrivateRoute>}
                        />
                        <Route
                            path="/transactions"
                            element={<PrivateRoute><Transactions /></PrivateRoute>}
                        />
                        <Route
                            path="/budgets"
                            element={<PrivateRoute><Budgets /></PrivateRoute>}
                        />
                        <Route
                            path="/analytics"
                            element={<PrivateRoute><Analytics /></PrivateRoute>}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkLoggedIn());
    }, [dispatch]);

    return <AppRoutes />;
}

export default App;
