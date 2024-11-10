import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import {shoesApi} from "../../api/api.ts";

interface Thumbnail {
    url: string;
    key: string;
}

interface Shoes {
    _id: string;
    brand: string;
    category: string;
    thumbnail: Thumbnail | null;
    name: string;
    describe: string | null;
    description: string | null;
    createdAt: string;
    classificationCount: number | null;
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

interface ShoesState {
    shoes: Shoes[];
    shoe: Shoes | null;
    pagination: Pagination | null;
    fetchAllStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchAllError: string | null;
    fetchError: string | null;
    createError: string | null;
    updateError: string | null;
}

const initialState: ShoesState = {
    shoes: [],
    shoe: null,
    pagination: null,
    fetchAllStatus: 'idle',
    fetchStatus: 'idle',
    createStatus: 'idle',
    updateStatus: 'idle',
    fetchAllError: null,
    fetchError: null,
    createError: null,
    updateError: null
}

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

const shoesSlice = createSlice({
    name: 'shoes',
    initialState,
    reducers: {
        resetCreateStatus(state) {
            state.createStatus = 'idle';
            state.createError = null;
        },
        resetUpdateStatus(state) {
            state.updateStatus = 'idle';
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        // Quản lý trạng thái cho fetchShoes
        builder
            .addCase(fetchShoes.pending, (state) => {
                state.fetchAllStatus = 'loading';
                state.fetchError = null;
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
                state.fetchAllStatus = 'succeeded';
            })
            .addCase(fetchShoes.rejected, (state, action) => {
                state.fetchAllStatus = 'failed';
                state.fetchError = action.error.message || 'Failed to fetch categories';
            })

        // Quản lý trạng thái cho fetchShoe
        builder
            .addCase(fetchShoe.pending, (state) => {
                state.fetchStatus = 'loading';
                state.fetchError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(fetchShoe.fulfilled, (state, action) => {
                state.shoe = action.payload.data || null;
                state.fetchStatus = 'succeeded';
            })
            .addCase(fetchShoe.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.fetchError = action.error.message || 'Failed to fetch category';
            });
    }
});
export const {
    resetCreateStatus,
    resetUpdateStatus
} = shoesSlice.actions;
export default shoesSlice.reducer;
