import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await api.get('/analytics/dashboard');
            setDashboardData(res.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchExpenses = useCallback(async () => {
        if (!user) return;
        try {
            const res = await api.get('/expenses');
            setExpenses(res.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch expenses');
        }
    }, [user]);

    const fetchIncomes = useCallback(async () => {
        if (!user) return;
        try {
            const res = await api.get('/incomes');
            setIncomes(res.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch incomes');
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
            fetchExpenses();
            fetchIncomes();
        } else {
            setExpenses([]);
            setIncomes([]);
            setDashboardData(null);
        }
    }, [user, fetchDashboardData, fetchExpenses, fetchIncomes]);

    const addExpense = async (expenseData) => {
        try {
            const res = await api.post('/expenses', expenseData);
            setExpenses([res.data.data, ...expenses]);
            fetchDashboardData(); // Refresh dashboard
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add expense');
            return false;
        }
    };

    const deleteExpense = async (id) => {
        try {
            await api.delete(`/expenses/${id}`);
            setExpenses(expenses.filter(ex => ex._id !== id));
            fetchDashboardData();
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete expense');
            return false;
        }
    };

    const updateExpense = async (id, expenseData) => {
        try {
            const res = await api.put(`/expenses/${id}`, expenseData);
            setExpenses(expenses.map(ex => ex._id === id ? res.data.data : ex));
            fetchDashboardData();
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update expense');
            return false;
        }
    };

    const addIncome = async (incomeData) => {
        try {
            const res = await api.post('/incomes', incomeData);
            setIncomes([res.data.data, ...incomes]);
            fetchDashboardData();
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add income');
            return false;
        }
    };

    return (
        <AppContext.Provider
            value={{
                expenses,
                incomes,
                dashboardData,
                loading,
                error,
                setError,
                fetchDashboardData,
                fetchExpenses,
                fetchIncomes,
                addExpense,
                deleteExpense,
                updateExpense,
                addIncome
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
