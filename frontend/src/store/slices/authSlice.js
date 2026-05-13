import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const checkLoggedIn = createAsyncThunk('auth/checkLoggedIn', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await api.get('/auth/me');
        return res.data.data;
    } catch (error) {
        localStorage.removeItem('token');
        return rejectWithValue(error.response?.data?.error || 'Authentication failed');
    }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        return res.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', res.data.token);
        return res.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
});

export const updateDetails = createAsyncThunk('auth/updateDetails', async ({ name, email }, { rejectWithValue }) => {
    try {
        const res = await api.put('/auth/updatedetails', { name, email });
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Update failed');
    }
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
        const res = await api.put('/auth/updatepassword', { currentPassword, newPassword });
        localStorage.setItem('token', res.data.token);
        return res.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Password update failed');
    }
});

const initialState = {
    user: null,
    loading: true, // initially true to wait for checkLoggedIn
    error: null,
    actionLoading: false // for login/register
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // checkLoggedIn
            .addCase(checkLoggedIn.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkLoggedIn.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(checkLoggedIn.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })
            // login
            .addCase(login.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.actionLoading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
                state.actionLoading = false;
            })
            // register
            .addCase(register.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.actionLoading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload;
                state.actionLoading = false;
            })
            // updateDetails
            .addCase(updateDetails.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateDetails.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload };
                state.actionLoading = false;
            })
            .addCase(updateDetails.rejected, (state, action) => {
                state.error = action.payload;
                state.actionLoading = false;
            })
            // updatePassword
            .addCase(updatePassword.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.user = action.payload;
                state.actionLoading = false;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.error = action.payload;
                state.actionLoading = false;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
