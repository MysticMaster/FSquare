import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import {classificationApi} from "../../api/api.ts";
import stateStatus from "../../utils/stateStatus.ts"

interface Media {
    url: string;
    key: string;
}

interface Shoes {
    _id: string;
    name: string;
}

interface Classification {
    _id: string;
    shoes: Shoes;
    color: string;
    thumbnail: Media | null;
    country: string;
    price: number;
    sizeCount: number | null;
    createdAt: string;
    isActive: boolean
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
    shoesOwn: Shoes | null;
    classifications: Classification[];
    classification: Classification | null;
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
    shoesOwn: null,
    classifications: [],
    classification: null,
    detailId: null,
    pagination: null,
    fetchAllStatus: stateStatus.idleState,
    fetchStatus: stateStatus.idleState,
    createStatus: stateStatus.idleState,
    updateStatus: stateStatus.idleState,
    fetchAllError: null,
    fetchError: null,
    createError: null,
    updateError: null,
}

export const createClassification = createAsyncThunk<Classification, FormData, {
    rejectValue: { code: number, error: string }
}>(
    'classifications/createClassification',
    async (classificationData, {rejectWithValue}) => {
        try {
            const response = await axiosClient.post(classificationApi.create, classificationData, {
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

export const fetchClassifications = createAsyncThunk(
    'classifications/fetchClassifications',
    async ({page, size, search, status, shoesId}: {
        page?: number;
        size?: number;
        search?: string;
        status?: boolean | null;
        shoesId?: string;
    }) => {
        const response = await axiosClient.get(`${classificationApi.getByShoesId}/${shoesId}`, {
            params: {page, size, search, status},
        });
        return response.data;
    }
);

export const fetchClassification = createAsyncThunk(
    'classifications/fetchClassification',
    async ({id}: { id?: string | null }) => {
        const response = await axiosClient.get(`${classificationApi.getById}/${id}`);
        return response.data;
    }
);

export const updateClassification = createAsyncThunk<Classification, { id: string; classificationData: FormData }, {
    rejectValue: { code: number, error: string }
}>(
    'classifications/updateClassification',
    async ({id, classificationData}, {rejectWithValue}) => {
        try {
            const response = await axiosClient.patch(`${classificationApi.update}/${id}`, classificationData, {
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

const classificationSlice = createSlice({
    name: 'classifications',
    initialState,
    reducers: {
        updateSizeCount(state, action: PayloadAction<string | null>) {
            const index = state.classifications.findIndex(classification => classification._id === action.payload);
            if (index !== -1) {
                const count = state.classifications[index].sizeCount || 0;
                state.classifications[index].sizeCount = count + 1;
            }
        },
        setShoesOwn(state, action: PayloadAction<Shoes | null>) {
            state.shoesOwn = action.payload;
        },
        setClassificationDetailId(state, action: PayloadAction<string | null>) {
            state.detailId = action.payload;
        },
        resetCreateStatus(state) {
            state.createStatus = stateStatus.idleState
            state.createError = null;
        },
        resetClassificationUpdateStatus(state) {
            state.updateStatus = stateStatus.idleState
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        // Quản lý trạng thái cho createClassification
        builder
            .addCase(createClassification.pending, (state) => {
                state.createStatus = stateStatus.loadingState;
                state.createError = null;
            })
            .addCase(createClassification.fulfilled, (state, action) => {
                state.classifications.unshift(action.payload);
                state.createStatus = stateStatus.succeededState;
                state.createError = null;
            })
            .addCase(createClassification.rejected, (state, action) => {
                state.createStatus = stateStatus.failedState;
                state.createError = action.payload || {code: 500, error: 'Sự cố không xác định'}
            });

        // Quản lý trạng thái cho fetchClassifications
        builder
            .addCase(fetchClassifications.pending, (state) => {
                state.fetchAllStatus = stateStatus.loadingState
                state.fetchAllError = null;
            })
            .addCase(fetchClassifications.fulfilled, (state, action) => {
                state.classifications = action.payload.data || [];
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
            .addCase(fetchClassifications.rejected, (state, action) => {
                state.fetchAllStatus = stateStatus.failedState
                state.fetchAllError = action.error.message || 'Failed to fetch categories';
            });

        // Quản lý trạng thái cho fetchClassification
        builder
            .addCase(fetchClassification.pending, (state) => {
                state.fetchStatus = stateStatus.loadingState;
                state.fetchError = null;
            })
            .addCase(fetchClassification.fulfilled, (state, action) => {
                state.classification = action.payload.data || null;
                state.fetchStatus = stateStatus.succeededState;
            })
            .addCase(fetchClassification.rejected, (state, action) => {
                state.fetchStatus = stateStatus.failedState
                state.fetchError = action.error.message || 'Failed to fetch category';
            });

        // Quản lý trạng thái cho updateClassification
        builder
            .addCase(updateClassification.pending, (state) => {
                state.updateStatus = stateStatus.loadingState;
                state.updateError = null;
            })
            .addCase(updateClassification.fulfilled, (state, action) => {
                const index = state.classifications.findIndex(classification => classification._id === action.payload._id);
                if (index !== -1) state.classifications[index] = action.payload;
                state.updateStatus = stateStatus.succeededState
                state.updateError = null
            })
            .addCase(updateClassification.rejected, (state, action) => {
                state.updateStatus = stateStatus.failedState
                state.updateError = action.payload || {code: 500, error: 'Sự cố không xác định'};
            });
    }
});

export const {
    updateSizeCount,
    setShoesOwn,
    setClassificationDetailId,
    resetCreateStatus,
    resetClassificationUpdateStatus,
} = classificationSlice.actions;

export default classificationSlice.reducer;
