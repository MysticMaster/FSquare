import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import {categoryApi} from '../../api/api';

interface Thumbnail {
    url: string;
    key: string;
}

interface Category {
    _id: string;
    thumbnail: Thumbnail | null;
    name: string;
    shoesCount: number | null;
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
    category: Category | null;
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

const initialState: CategoryState = {
    categories: [],
    category: null,
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

export const createCategory = createAsyncThunk<Category, FormData, { rejectValue: { error: string } }>(
    'categories/createCategory',
    async (categoryData, {rejectWithValue}) => {
        try {
            const response = await axiosClient.post(categoryApi.create, categoryData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.status === 201) {
                return response.data.data;
            } else if (response.status === 400) {
                return rejectWithValue({error: 'Trống tên danh mục'});
            } else if (response.status === 409) {
                return rejectWithValue({error: 'Tên danh mục đã tồn tại'});
            } else {
                return rejectWithValue({error: 'Sự cố máy chủ'});
            }
        } catch (error: any) {
            return rejectWithValue({error: error.message || 'Sự cố không xác định'});
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async ({page, size, search, status}: {
        page?: number;
        size?: number;
        search?: string,
        status?: boolean | null
    }) => {
        const response = await axiosClient.get(categoryApi.getAll, {
            params: {page, size, search, status},
        });
        return response.data;
    }
);

export const fetchCategory = createAsyncThunk(
    'categories/fetchCategory',
    async ({id}: { id?: string | null }) => {
        const response = await axiosClient.get(`${categoryApi.getById}/${id}`);
        return response.data;
    }
);

export const updateCategory = createAsyncThunk<Category, { id: string; categoryData: FormData }, {
    rejectValue: { error: string }
}>(
    'categories/updateCategory',
    async ({id, categoryData}, {rejectWithValue}) => {
        try {
            const response = await axiosClient.patch(`${categoryApi.update}/${id}`, categoryData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                return response.data.data; // Trả về dữ liệu danh mục đã cập nhật
            } else if (response.status === 400) {
                return rejectWithValue({error: 'Trống tên danh mục'});
            } else if (response.status === 409) {
                return rejectWithValue({error: 'Tên danh mục đã tồn tại'});
            } else {
                return rejectWithValue({error: 'Sự cố máy chủ'});
            }
        } catch (error: any) {
            return rejectWithValue({error: error.message || 'Sự cố không xác định'});
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
        resetUpdateStatus(state) {
            state.updateStatus = 'idle';
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
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
                state.createError = action.payload?.error || 'Failed to create brand';
            });

        // Quản lý trạng thái cho fetchCategories
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.fetchAllStatus = 'loading';
                state.fetchAllError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload.data || [];
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
            .addCase(fetchCategories.rejected, (state, action) => {
                state.fetchAllStatus = 'failed';
                state.fetchAllError = action.error.message || 'Failed to fetch categories';
            });

        // Quản lý trạng thái cho fetchCategory
        builder
            .addCase(fetchCategory.pending, (state) => {
                state.fetchStatus = 'loading';
                state.fetchError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.category = action.payload.data || null;
                state.fetchStatus = 'succeeded';
            })
            .addCase(fetchCategory.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.fetchError = action.error.message || 'Failed to fetch category';
            });

        // Quản lý trạng thái cho updateCategory
        builder
            .addCase(updateCategory.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(category => category._id === action.payload._id);
                if (index !== -1) state.categories[index] = action.payload;
                state.updateStatus = 'succeeded';
                state.updateError = null;  // Reset lỗi
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload?.error || 'Failed to create brand';
            });
    }
});
export const {
    resetCreateStatus,
    resetUpdateStatus
} = categorySlice.actions;
export default categorySlice.reducer;
