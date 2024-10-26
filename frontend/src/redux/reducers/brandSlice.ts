import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import {brandApi} from '../../api/api';

interface Thumbnail {
    url: string;
    key: string;
}

interface Brand {
    _id: string;
    thumbnail: Thumbnail | null;
    name: string;
    shoesCount: number;
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

interface BrandState {
    brands: Brand[];
    pagination: Pagination | null;
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchError: string | null;
    createError: string | null;
}

const initialState: BrandState = {
    brands: [],
    pagination: null,
    fetchStatus: 'idle',
    createStatus: 'idle',
    fetchError: null,
    createError: null,
};

export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands',
    async ({page, size, search}: { page?: number; size?: number; search?: string }) => {
        const response = await axiosClient.get(brandApi.getAll, {
            params: {page, size, search},
        });
        return response.data; // Giả định rằng dữ liệu bao gồm cả brands và pagination
    }
);
export const createBrand = createAsyncThunk<Brand, FormData, { rejectValue: { error: string } }>(
    'brands/createBrand',
    async (brandData, {rejectWithValue}) => {
        try {
            const response = await axiosClient.post(brandApi.create, brandData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.status === 201) {
                return response.data.data;
            } else if (response.status === 400) {
                return rejectWithValue({error: 'Trống tên thương hiệu'});
            } else if (response.status === 409) {
                return rejectWithValue({error: 'Tên thương hiệu đã tồn tại'});
            } else {
                return rejectWithValue({error: 'Sự cố máy chủ'});
            }
        } catch (error: any) {
            return rejectWithValue({error: error.message || 'Sự cố không xác định'});
        }
    }
);

const brandSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {
        resetCreateStatus(state) {
            state.createStatus = 'idle'; // Reset trạng thái về idle
            state.createError = null; // Reset lỗi
        },
    },
    extraReducers: (builder) => {
        // Quản lý trạng thái cho fetchBrands
        builder
            .addCase(fetchBrands.pending, (state) => {
                state.fetchStatus = 'loading';
                state.fetchError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.brands = action.payload.data || []; // Assume that data is in action.payload.data
                state.pagination = {
                    size: action.payload.options.size,
                    totalItems: action.payload.options.totalItems,
                    totalPages: action.payload.options.totalPages,
                    page: action.payload.options.page,
                    hasNextPage: action.payload.options.hasNextPage,
                    hasPreviousPage: action.payload.options.hasPreviousPage,
                    nextPage: action.payload.options.nextPage,
                    prevPage: action.payload.options.prevPage
                }; // Assume pagination info is directly in action.payload
                state.fetchStatus = 'succeeded';
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.fetchError = action.error.message || 'Failed to fetch brands';
            });

        // Quản lý trạng thái cho createBrand
        builder
            .addCase(createBrand.pending, (state) => {
                state.createStatus = 'loading';
                state.createError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(createBrand.fulfilled, (state, action) => {
                state.brands.unshift(action.payload); // Thêm vào đầu mảng
                state.createStatus = 'succeeded';
                state.createError = null;  // Reset lỗi
            })
            .addCase(createBrand.rejected, (state, action) => {
                state.createStatus = 'failed';
                // Gán lỗi từ rejectWithValue nếu có
                state.createError = action.payload?.error || 'Failed to create brand';
            });
    }
});
export const {resetCreateStatus} = brandSlice.actions;
export default brandSlice.reducer;
