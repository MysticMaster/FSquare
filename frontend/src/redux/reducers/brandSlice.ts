import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import {brandApi} from '../../api/api';

interface thumbnail {
    url: string;
    key: string;
}

interface Brand {
    _id: string;
    thumbnail: thumbnail | null;
    name: string;
    shoesCount: number;
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

export const createBrand = createAsyncThunk(
    'brands/createBrand',
    async (brandData: FormData) => {
        const response = await axiosClient.post(brandApi.create, brandData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
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
            })
            .addCase(createBrand.fulfilled, (state, action) => {
                state.brands = [action.payload, ...state.brands];
            });
    },
});

export default brandSlice.reducer;
