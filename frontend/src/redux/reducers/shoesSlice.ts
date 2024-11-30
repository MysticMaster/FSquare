import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import {shoesApi} from "../../api/api.ts";
import stateStatus from "../../utils/stateStatus.ts";

interface Thumbnail {
    url: string;
    key: string;
}

interface Brand {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
}

interface Shoes {
    _id: string;
    brand: Brand;
    category: Category;
    thumbnail: Thumbnail | null;
    name: string;
    describe: string | null;
    description: string | null;
    classificationCount: number | null;
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

interface ShoesState {
    shoes: Shoes[];
    shoe: Shoes | null;
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

const initialState: ShoesState = {
    shoes: [],
    shoe: null,
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

export const createShoes = createAsyncThunk<Shoes, FormData, { rejectValue: { code: number, error: string } }>(
    'shoes/createShoes',
    async (shoesData, {rejectWithValue}) => {
        try {
            const response = await axiosClient.post(shoesApi.create, shoesData, {
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


export const fetchShoes = createAsyncThunk(
    'shoes/fetchShoes',
    async ({page, size, search, status, brandId, categoryId}: {
        page?: number;
        size?: number;
        search?: string;
        status?: boolean | null;
        brandId?: string;
        categoryId?: string;
    }) => {
        const response = await axiosClient.get(shoesApi.getAll, {
            params: {page, size, search, status, brand: brandId, category: categoryId},
        });
        return response.data;
    }
);

export const fetchShoe = createAsyncThunk(
    'shoes/fetchShoe',
    async ({id}: { id?: string | null }) => {
        const response = await axiosClient.get(`${shoesApi.getById}/${id}`);
        return response.data;
    }
);

export const updateShoes = createAsyncThunk<Shoes, { id: string; shoesData: FormData }, {
    rejectValue: { code: number, error: string }
}>(
    'shoes/updateShoes',
    async ({id, shoesData}, {rejectWithValue}) => {
        try {
            const response = await axiosClient.patch(`${shoesApi.update}/${id}`, shoesData, {
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

const shoesSlice = createSlice({
    name: 'shoes',
    initialState,
    reducers: {
        updateClassificationCount(state, action: PayloadAction<string | null>) {
            const index = state.shoes.findIndex(shoe => shoe._id === action.payload);
            if (index !== -1) {
                const count = state.shoes[index].classificationCount || 0;
                state.shoes[index].classificationCount = count + 1;
            }
        },
        setShoesIdDetail(state, action: PayloadAction<string | null>) {
            state.detailId = action.payload;
        },
        resetCreateStatus(state) {
            state.createStatus = stateStatus.idleState
            state.createError = null;
        },
        resetShoesUpdateStatus(state) {
            state.updateStatus = stateStatus.idleState
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        // Quản lý trạng thái cho createShoes
        builder
            .addCase(createShoes.pending, (state) => {
                state.createStatus = stateStatus.loadingState;
                state.createError = null;
            })
            .addCase(createShoes.fulfilled, (state, action) => {
                state.shoes.unshift(action.payload);
                state.createStatus = stateStatus.succeededState;
                state.createError = null;
            })
            .addCase(createShoes.rejected, (state, action) => {
                state.createStatus = stateStatus.failedState;
                state.createError = action.payload || {code: 500, error: 'Sự cố không xác định'};
            });

        // Quản lý trạng thái cho fetchShoes
        builder
            .addCase(fetchShoes.pending, (state) => {
                state.fetchAllStatus = stateStatus.loadingState
                state.fetchAllError = null;
            })
            .addCase(fetchShoes.fulfilled, (state, action) => {
                state.shoes = action.payload.data || [];
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
            .addCase(fetchShoes.rejected, (state, action) => {
                state.fetchAllStatus = stateStatus.failedState
                state.fetchAllError = action.error.message || 'Failed to fetch categories';
            })

        // Quản lý trạng thái cho fetchShoe
        builder
            .addCase(fetchShoe.pending, (state) => {
                state.fetchStatus = stateStatus.loadingState
                state.fetchError = null;
            })
            .addCase(fetchShoe.fulfilled, (state, action) => {
                state.shoe = action.payload.data || null;
                state.fetchStatus = stateStatus.succeededState
            })
            .addCase(fetchShoe.rejected, (state, action) => {
                state.fetchStatus = stateStatus.failedState
                state.fetchError = action.error.message || 'Failed to fetch category';
            });

        // Quản lý trạng thái cho updateShoes
        builder
            .addCase(updateShoes.pending, (state) => {
                state.updateStatus = stateStatus.loadingState;
                state.updateError = null
            })
            .addCase(updateShoes.fulfilled, (state, action) => {
                const index = state.shoes.findIndex(shoe => shoe._id === action.payload._id);
                if (index !== -1) state.shoes[index] = action.payload;
                state.updateStatus = stateStatus.succeededState
                state.updateError = null
            })
            .addCase(updateShoes.rejected, (state, action) => {
                state.updateStatus = stateStatus.failedState
                state.updateError = action.payload || {code: 500, error: 'Sự cố không xác định'};
            });
    }
});
export const {
    updateClassificationCount,
    setShoesIdDetail,
    resetCreateStatus,
    resetShoesUpdateStatus
} = shoesSlice.actions;
export default shoesSlice.reducer;
