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
    brand: Brand | null;
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

const initialState: BrandState = {
    brands: [],
    brand: null,
    pagination: null,
    fetchAllStatus: 'idle',
    fetchStatus: 'idle',
    createStatus: 'idle',
    updateStatus: 'idle',
    fetchAllError: null,
    fetchError: null,
    createError: null,
    updateError: null
};

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

export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands',
    async ({page, size, search, status}: {
        page?: number;
        size?: number;
        search?: string,
        status?: boolean | null
    }) => {
        const response = await axiosClient.get(brandApi.getAll, {
            params: {page, size, search, status},
        });
        return response.data;
    }
);

export const fetchBrand = createAsyncThunk(
    'brands/fetchBrand',
    async ({id}: { id?: string | null }) => {
        const response = await axiosClient.get(`${brandApi.getById}/${id}`);
        return response.data;
    }
);

export const updateBrand = createAsyncThunk<Brand, { id: string; brandData: FormData }, {
    rejectValue: { error: string }
}>(
    'brands/updateBrand',
    async ({id, brandData}, {rejectWithValue}) => {
        try {
            const response = await axiosClient.patch(`${brandApi.update}/${id}`, brandData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                return response.data.data; // Trả về dữ liệu danh mục đã cập nhật
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
        resetUpdateStatus(state) {
            state.updateStatus = 'idle';
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
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
                state.createError = action.payload?.error || 'Failed to create brand';
            });

        // Quản lý trạng thái cho fetchBrands
        builder
            .addCase(fetchBrands.pending, (state) => {
                state.fetchAllStatus = 'loading';
                state.fetchAllError = null;  // Reset lỗi trước khi bắt đầu
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
                state.fetchAllStatus = 'succeeded';
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.fetchAllStatus = 'failed';
                state.fetchAllError = action.error.message || 'Failed to fetch brands';
            });

        // Quản lý trạng thái cho fetchBrand
        builder
            .addCase(fetchBrand.pending, (state) => {
                state.fetchStatus = 'loading';
                state.fetchError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(fetchBrand.fulfilled, (state, action) => {
                state.brand = action.payload.data || null;
                state.fetchStatus = 'succeeded';
            })
            .addCase(fetchBrand.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.fetchError = action.error.message || 'Failed to fetch brand';
            });

        // Quản lý trạng thái cho updateBrand
        builder
            .addCase(updateBrand.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(updateBrand.fulfilled, (state, action) => {
                const index = state.brands.findIndex(brand => brand._id === action.payload._id);
                if (index !== -1) state.brands[index] = action.payload;
                state.updateStatus = 'succeeded';
                state.updateError = null;  // Reset lỗi
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload?.error || 'Failed to create brand';
            });
    }
});
export const {
    resetCreateStatus,
    resetUpdateStatus
} = brandSlice.actions;
export default brandSlice.reducer;
