// authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import { adminApi, authApi } from '../../api/api';

interface Admin {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    phone: string;
    fcmToken: string;
}

interface AuthState {
    authority: string | null;
    admin: Admin | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    authority: null,
    admin: null,
    status: 'idle',
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post(authApi.login, { username, password });
            if (response.status === 200 && response.data.data) {
                return response.data.data;
            } else {
                throw new Error('Login failed');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Unable to login');
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(adminApi.getProfile, { withCredentials: true });
            if (response.status === 200) {
                return response.data.data;
            } else {
                return rejectWithValue('Not authenticated');
            }
        } catch (error) {
            return rejectWithValue('Not authenticated');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.authority = null;
            state.admin = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.authority = action.payload.authority;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = `${action.payload}`;
            })
            .addCase(checkAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.authority = action.payload.authority;
                state.admin = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = `${action.payload}`;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
