import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import {adminApi, authApi} from '../../api/api';
import stateStatus from "../../utils/stateStatus.ts";

interface Admin {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    phone: string;
    authority: string;
    fcmToken: string;
}

interface AuthState {
    authority: string | null;
    admin: Admin | null;
    status: string | null;
    uError: string | null;
    pError: string | null;
}

const initialState: AuthState = {
    authority: null,
    admin: null,
    status: stateStatus.idleState,
    uError: null,
    pError: null
};

export const login = createAsyncThunk<{ authority: string; status: string }, { username: string; password: string }, { rejectValue: { uError?: string; pError?: string } }>(
    'auth/login',
    async ({username, password}, {rejectWithValue}) => {
        try {
            const response = await axiosClient.post(authApi.login, {username, password}, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200 && response.data.data) {
                return {authority: response.data.data, status: 'success'};
            } else if (response.status === 404) {
                return rejectWithValue({uError: 'Tên đăng nhập không tồn tại'});
            } else if (response.status === 409) {
                return rejectWithValue({pError: 'Mật khẩu không đúng'});
            } else {
                throw new Error('LoginPage failed');
            }
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof Error) {
                return rejectWithValue({uError: 'LoginPage failed', pError: 'LoginPage failed'});
            }
            return rejectWithValue({uError: 'Unable to login', pError: 'Unable to login'});
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosClient.get(adminApi.getProfile, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
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
            state.status = stateStatus.idleState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = stateStatus.loadingState;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.authority = action.payload.authority;
                state.status = stateStatus.succeededState;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = stateStatus.failedState;
                state.uError = action.payload?.uError || null;
                state.pError = action.payload?.pError || null;
            })
            .addCase(checkAuth.pending, (state) => {
                state.status = stateStatus.loadingState;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.authority = action.payload.authority;
                state.admin = action.payload;
                state.status = stateStatus.succeededState;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.status = stateStatus.failedState;
            });
    },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;
