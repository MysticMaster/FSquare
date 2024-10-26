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
    pagination: Pagination | null;
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchError: string | null;
    createError: string | null;
}

const initialState: ShoesState = {
    shoes: [],
    pagination: null,
    fetchStatus: 'idle',
    createStatus: 'idle',
    fetchError: null,
    createError: null,
}

export const fetchShoes = createAsyncThunk(
    'shoes/fetchShoes',
    async ({page, size, search, brandId, categoryId}: {
        page?: number;
        size?: number;
        search?: string;
        brandId?: string;
        categoryId?: string;
    }) => {
        const response = await axiosClient.get(shoesApi.getAll, {
            params: {page, size, search, brand: brandId, category: categoryId},
        });
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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShoes.pending, (state) => {
                state.fetchStatus = 'loading';
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
                state.fetchStatus = 'succeeded';
            })
            .addCase(fetchShoes.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.fetchError = action.error.message || 'Failed to fetch categories';
            })

    }
});
export const {resetCreateStatus} = shoesSlice.actions;
export default shoesSlice.reducer;
