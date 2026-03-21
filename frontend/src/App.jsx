import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="loader" style={{ margin: '50px auto' }}></div>;

    return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    const { user } = useContext(AuthContext);

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
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <AppRoutes />
            </AppProvider>
        </AuthProvider>
    );
}

export default App;
