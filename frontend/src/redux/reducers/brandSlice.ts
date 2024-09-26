import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import { brandApi } from '../../api/api';

interface thumbnail{
    url:string;
    key:string;
}

interface Brand {
    _id: string;
    thumbnail: thumbnail;
    name: string;
    createdAt: string;
    isActive: boolean;
}

interface BrandState {
    brands: Brand[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: BrandState = {
    brands: [],
    status: 'idle',
    error: null,
};

export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands',
    async () => {
        const response = await axiosClient.get(brandApi.getAll);
        return response.data.data;
    }
);

const brandSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrands.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.brands = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch brands';
            });
    },
});

export default brandSlice.reducer;
