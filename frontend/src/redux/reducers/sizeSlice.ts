import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import {sizeApi} from "../../api/api.ts";
import stateStatus from "../../utils/stateStatus.ts"

interface Classification {
    _id: string;
    color: string;
}

interface ClassificationOwn {
    _id: string;
    color: string;
    name: string;
}

interface Size {
    _id: string;
    classification: Classification;
    sizeNumber: number;
    weight: number;
    quantity: number;
    createdAt: string;
    isActive: boolean;
}

interface Pagination {
    size: number;
    totalItems: number;
    totalPages: number;
    page: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

interface ClassificationState {
    classificationOwn: ClassificationOwn | null;
    sizes: Size[];
    size: Size | null;
    detailId: string | null;
    pagination: Pagination | null;
    fetchAllStatus: string;
    fetchStatus: string;
    createStatus: string;
    updateStatus: string;
    fetchAllError: string | null;
    fetchError: string | null;
    createError: { code: number, error: string } | null;
    updateError: { code: number, error: string } | null;
}

const initialState: ClassificationState = {
    classificationOwn: null,
    sizes: [],
    size: null,
    detailId: null,
    pagination: null,
    fetchAllStatus: stateStatus.idleState,
    fetchStatus: stateStatus.idleState,
    createStatus: stateStatus.idleState,
    updateStatus: stateStatus.idleState,
    fetchAllError: null,
    fetchError: null,
    createError: null,
    updateError: null
}

export const createSize = createAsyncThunk<Size, FormData, {
    rejectValue: { code: number, error: string }
}>(
    'sizes/createSize',
    async (sizeData, {rejectWithValue}) => {
        try {
            const response = await axiosClient.post(sizeApi.create, sizeData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                return response.data.data;
            } else {
                return rejectWithValue({code: response.status, error: response.data.message});
            }
        } catch (error: any) {
            return rejectWithValue({code: 500, error: error.message || 'Sự cố không xác định'});
        }
    }
);

export const fetchSizes = createAsyncThunk(
    'sizes/fetchSizes',
    async ({page, size, search, status, classificationId}: {
        page?: number;
        size?: number;
        search?: string;
        status?: boolean | null;
        classificationId?: string;
    }) => {
        const response = await axiosClient.get(`${sizeApi.getByClassificationId}/${classificationId}`, {
            params: {page, size, search, status},
        });
        return response.data;
    }
);

export const fetchSize = createAsyncThunk(
    'sizes/fetchSize',
    async ({id}: { id?: string | null }) => {
        const response = await axiosClient.get(`${sizeApi.getById}/${id}`);
        return response.data;
    }
);

export const updateSize = createAsyncThunk<Size, { id: string; sizeData: FormData }, {
    rejectValue: { code: number, error: string }
}>(
    'sizes/updateSize',
    async ({id, sizeData}, {rejectWithValue}) => {
        try {
            const response = await axiosClient.patch(`${sizeApi.update}/${id}`, sizeData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                return response.data.data;
            } else {
                return rejectWithValue({code: response.status, error: response.data.message});
            }
        } catch (error: any) {
            return rejectWithValue({code: 500, error: error.message || 'Sự cố không xác định'});
        }
    }
);

const sizeSlice = createSlice({
    name: 'sizes',
    initialState,
    reducers: {
        setClassificationOwn(state, action: PayloadAction<ClassificationOwn | null>) {
            state.classificationOwn = action.payload;
        },
        setSizeDetailId(state, action: PayloadAction<string | null>) {
            state.detailId = action.payload;
        },
        resetCreateStatus(state) {
            state.createStatus = stateStatus.idleState
            state.createError = null;
        },
        resetUpdateStatus(state) {
            state.updateStatus = stateStatus.idleState
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        // Quản lý trạng thái cho createSize
        builder
            .addCase(createSize.pending, (state) => {
                state.createStatus = stateStatus.loadingState;
                state.createError = null;
            })
            .addCase(createSize.fulfilled, (state, action) => {
                state.sizes.unshift(action.payload);
                state.createStatus = stateStatus.succeededState;
                state.createError = null;
            })
            .addCase(createSize.rejected, (state, action) => {
                state.createStatus = stateStatus.failedState;
                state.createError = action.payload || {code: 500, error: 'Sự cố không xác định'}
            });

        // Quản lý trạng thái cho fetchSizes
        builder
            .addCase(fetchSizes.pending, (state) => {
                state.fetchAllStatus = stateStatus.loadingState
                state.fetchAllError = null;
            })
            .addCase(fetchSizes.fulfilled, (state, action) => {
                state.sizes = action.payload.data || [];
                state.pagination = {
                    size: action.payload.options.size,
                    totalItems: action.payload.options.totalItems,
                    totalPages: action.payload.options.totalPages,
                    page: action.payload.options.page,
                    hasNextPage: action.payload.options.hasNextPage,
                    hasPreviousPage: action.payload.options.hasPreviousPage,
                    nextPage: action.payload.options.nextPage,
                    prevPage: action.payload.options.prevPage
                };
                state.fetchAllStatus = stateStatus.succeededState
            })
            .addCase(fetchSizes.rejected, (state, action) => {
                state.fetchAllStatus = stateStatus.failedState
                state.fetchAllError = action.error.message || 'Failed to fetch categories';
            });

        // Quản lý trạng thái cho fetchSize
        builder
            .addCase(fetchSize.pending, (state) => {
                state.fetchStatus = stateStatus.loadingState;
                state.fetchError = null;
            })
            .addCase(fetchSize.fulfilled, (state, action) => {
                state.size = action.payload.data || null;
                state.fetchStatus = stateStatus.succeededState;
            })
            .addCase(fetchSize.rejected, (state, action) => {
                state.fetchStatus = stateStatus.failedState
                state.fetchError = action.error.message || 'Failed to fetch category';
            });

        // Quản lý trạng thái cho updateSize
        builder
            .addCase(updateSize.pending, (state) => {
                state.updateStatus = stateStatus.loadingState;
                state.updateError = null;
            })
            .addCase(updateSize.fulfilled, (state, action) => {
                const index = state.sizes.findIndex(size => size._id === action.payload._id);
                if (index !== -1) state.sizes[index] = action.payload;
                state.updateStatus = stateStatus.succeededState
                state.updateError = null
            })
            .addCase(updateSize.rejected, (state, action) => {
                state.updateStatus = stateStatus.failedState
                state.updateError = action.payload || {code: 500, error: 'Sự cố không xác định'};
            });
    }
});

export const {
    setClassificationOwn,
    setSizeDetailId,
    resetCreateStatus,
    resetUpdateStatus
} = sizeSlice.actions;

export default sizeSlice.reducer;
