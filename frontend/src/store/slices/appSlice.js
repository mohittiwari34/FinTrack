import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboardData = createAsyncThunk('app/fetchDashboardData', async (params, { rejectWithValue }) => {
    try {
        const res = await api.get('/analytics/dashboard', { params });
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch dashboard data');
    }
});

export const fetchExpenses = createAsyncThunk('app/fetchExpenses', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/expenses');
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch expenses');
    }
});

export const fetchIncomes = createAsyncThunk('app/fetchIncomes', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/incomes');
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch incomes');
    }
});

export const addExpense = createAsyncThunk('app/addExpense', async (expenseData, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.post('/expenses', expenseData);
        dispatch(fetchDashboardData());
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add expense');
    }
});

export const deleteExpense = createAsyncThunk('app/deleteExpense', async (id, { rejectWithValue, dispatch }) => {
    try {
        await api.delete(`/expenses/${id}`);
        dispatch(fetchDashboardData());
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete expense');
    }
});

export const updateExpense = createAsyncThunk('app/updateExpense', async ({ id, expenseData }, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.put(`/expenses/${id}`, expenseData);
        dispatch(fetchDashboardData());
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update expense');
    }
});

export const updateIncome = createAsyncThunk('app/updateIncome', async ({ id, incomeData }, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.put(`/incomes/${id}`, incomeData);
        dispatch(fetchDashboardData());
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update income');
    }
});

export const addIncome = createAsyncThunk('app/addIncome', async (incomeData, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.post('/incomes', incomeData);
        dispatch(fetchDashboardData());
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add income');
    }
});

export const deleteIncome = createAsyncThunk('app/deleteIncome', async (id, { rejectWithValue, dispatch }) => {
    try {
        await api.delete(`/incomes/${id}`);
        dispatch(fetchDashboardData());
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete income');
    }
});

export const scanReceipt = createAsyncThunk('app/scanReceipt', async (file, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('receipt', file);
        const res = await api.post('/expenses/upload-receipt', formData);
        return res.data.data; // { receiptUrl, amount, date, extractedText }
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to scan receipt');
    }
});

const initialState = {
    expenses: [],
    incomes: [],
    dashboardData: null,
    loading: false, // overall loading for dashboard
    error: null,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        clearAppError: (state) => {
            state.error = null;
        },
        clearAppData: (state) => {
            state.expenses = [];
            state.incomes = [];
            state.dashboardData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Dashboard
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.dashboardData = action.payload;
                state.loading = false;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            // Expenses
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.expenses = action.payload;
            })
            // Incomes
            .addCase(fetchIncomes.fulfilled, (state, action) => {
                state.incomes = action.payload;
            })
            // Add Expense
            .addCase(addExpense.fulfilled, (state, action) => {
                state.expenses.unshift(action.payload);
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete Expense
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.expenses = state.expenses.filter(ex => ex._id !== action.payload);
            })
            // Update Expense
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.expenses = state.expenses.map(ex => ex._id === action.payload._id ? action.payload : ex);
            })
            // Add Income
            .addCase(addIncome.fulfilled, (state, action) => {
                state.incomes.unshift(action.payload);
            })
            .addCase(addIncome.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Update Income
            .addCase(updateIncome.fulfilled, (state, action) => {
                state.incomes = state.incomes.map(inc => inc._id === action.payload._id ? action.payload : inc);
            })
            // Delete Income
            .addCase(deleteIncome.fulfilled, (state, action) => {
                state.incomes = state.incomes.filter(inc => inc._id !== action.payload);
            });
    }
});

export const { clearAppError, clearAppData } = appSlice.actions;
export default appSlice.reducer;
