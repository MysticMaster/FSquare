import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import { categoryApi } from '../../api/api';

interface thumbnail {
    url: string;
    key: string;
}

interface Category {
    _id: string;
    thumbnail: thumbnail | null;
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

interface CategoryState {
    categories: Category[];
    pagination: Pagination | null;
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchError: string | null;
    createError: string | null;
}

const initialState: CategoryState = {
    categories: [],
    pagination: null,
    fetchStatus: 'idle',
    createStatus: 'idle',
    fetchError: null,
    createError: null,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async ({ page = 1, size = 5 }: { page?: number; size?: number }) => {
        const response = await axiosClient.get(categoryApi.getAll, {
            params: { page, size },
        });
        return response.data; // Giả định rằng dữ liệu bao gồm cả categories và pagination
    }
);
export const createCategory = createAsyncThunk<Category, FormData, { rejectValue: { error: string } }>(
    'categories/createCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post(categoryApi.create, categoryData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.status === 201) {
                return response.data.data;
            } else if (response.status === 400) {
                return rejectWithValue({ error: 'Trống tên danh mục' });
            } else if (response.status === 409) {
                return rejectWithValue({ error: 'Tên danh mục đã tồn tại' });
            } else {
                return rejectWithValue({ error: 'Sự cố máy chủ' });
            }
        } catch (error: any) {
            return rejectWithValue({ error: error.message || 'Sự cố không xác định' });
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        resetCreateStatus(state) {
            state.createStatus = 'idle'; // Reset trạng thái về idle
            state.createError = null; // Reset lỗi
        },
    },
    extraReducers: (builder) => {
        // Quản lý trạng thái cho fetchCategories
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.fetchStatus = 'loading';
                state.fetchError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload.data || []; // Assume that data is in action.payload.data
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
            .addCase(fetchCategories.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.fetchError = action.error.message || 'Failed to fetch categories';
            });

        // Quản lý trạng thái cho createCategory
        builder
            .addCase(createCategory.pending, (state) => {
                state.createStatus = 'loading';
                state.createError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.unshift(action.payload); // Thêm vào đầu mảng
                state.createStatus = 'succeeded';
                state.createError = null;  // Reset lỗi
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.createStatus = 'failed';
                // Gán lỗi từ rejectWithValue nếu có
                state.createError = action.payload?.error || 'Failed to create brand';
            });
    }
});
export const { resetCreateStatus } = categorySlice.actions;
export default categorySlice.reducer;
