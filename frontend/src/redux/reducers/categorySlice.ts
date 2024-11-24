import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import {categoryApi} from '../../api/api';
import stateStatus from "../../utils/stateStatus.ts";

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
    detailId: string | null;
    pagination: Pagination | null;
    fetchAllStatus: string;
    fetchStatus: string;
    createStatus: string;
    updateStatus: string;
    fetchAllError: string | null;
    fetchError: string | null;
    createError: string | null;
    updateError: string | null;
}

const initialState: CategoryState = {
    categories: [],
    category: null,
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
        setCategoryIdDetail(state, action: PayloadAction<string | null>) {
            state.detailId = action.payload;
        },
        resetCreateStatus(state) {
            state.createStatus = stateStatus.idleState;
            state.createError = null; // Reset lỗi
        },
        resetUpdateStatus(state) {
            state.updateStatus = stateStatus.idleState;
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        // Quản lý trạng thái cho createCategory
        builder
            .addCase(createCategory.pending, (state) => {
                state.createStatus = stateStatus.loadingState;
                state.createError = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.unshift(action.payload); // Thêm vào đầu mảng
                state.createStatus = stateStatus.succeededState;
                state.createError = null;  // Reset lỗi
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.createStatus = stateStatus.failedState;
                state.createError = action.payload?.error || 'Failed to create brand';
            });

        // Quản lý trạng thái cho fetchCategories
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.fetchAllStatus = stateStatus.loadingState;
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
                state.fetchAllStatus = stateStatus.succeededState;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.fetchAllStatus = stateStatus.failedState;
                state.fetchAllError = action.error.message || 'Failed to fetch categories';
            });

        // Quản lý trạng thái cho fetchCategory
        builder
            .addCase(fetchCategory.pending, (state) => {
                state.fetchStatus = stateStatus.loadingState;
                state.fetchError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.category = action.payload.data || null;
                state.fetchStatus = stateStatus.succeededState;
            })
            .addCase(fetchCategory.rejected, (state, action) => {
                state.fetchStatus = stateStatus.failedState;
                state.fetchError = action.error.message || 'Failed to fetch category';
            });

        // Quản lý trạng thái cho updateCategory
        builder
            .addCase(updateCategory.pending, (state) => {
                state.updateStatus = stateStatus.loadingState;
                state.updateError = null;  // Reset lỗi trước khi bắt đầu
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(category => category._id === action.payload._id);
                if (index !== -1) state.categories[index] = action.payload;
                state.updateStatus = stateStatus.succeededState;
                state.updateError = null;  // Reset lỗi
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.updateStatus = stateStatus.failedState;
                state.updateError = action.payload?.error || 'Failed to update category';
            });
    }
});
export const {
    setCategoryIdDetail,
    resetCreateStatus,
    resetUpdateStatus
} = categorySlice.actions;
export default categorySlice.reducer;
