import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import stateStatus from "../../utils/stateStatus.ts"
import {orderApi} from "../../api/api.ts";

interface Thumbnail {
    url: string;
}

interface Shoes {
    _id: string;
    name: string;
}

interface Classification {
    _id: string;
    color: string;
    thumbnail: Thumbnail | null
}

interface Size {
    _id: string;
    sizeNumber: string;
}

interface OrderItem {
    _id: string;
    shoes: Shoes | null;
    classification: Classification | null;
    size: Size | null;
    price: number;
    quantity: number;
}

interface Customer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface ShippingAddress {
    toName: string;
    toAddress: string;
    toProvinceName: string;
    toDistrictName: string;
    toWardName: string;
    toPhone: string;
}

interface StatusTimestamps {
    pending: string;
    processing: string;
    shipped: string;
    delivered: string;
    confirmed: string;
    cancelled: string;
    returned: string
}

interface ReturnInfo {
    reason: string;
    returnDate: string;
    status: string;
    statusTimestamps: {
        initiated: string,
        completed: string,
        refunded: string
    }
}

interface Order {
    _id: string;
    clientOrderCode: string;
    customer: Customer;
    shippingAddress: ShippingAddress;
    orderItems: OrderItem[] | number;
    weight: number;
    codAmount: number;
    shippingFee: number;
    content: string | null;
    isFreeShip: boolean;
    isPayment: boolean;
    note: string | null;
    status: string;
    statusTimestamps: StatusTimestamps | null;
    returnInfo: ReturnInfo | null;
    createdAt: string;
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

interface OrderState {
    orders: Order[];
    order: Order | null;
    detailId: string | null;
    pagination: Pagination | null;
    fetchAllStatus: string;
    fetchStatus: string;
    updateStatus: string;
    fetchAllError: string | null;
    fetchError: string | null;
    updateError: { code: number, error: string } | null;
}

const initialState: OrderState = {
    orders: [],
    order: null,
    detailId: null,
    pagination: null,
    fetchAllStatus: stateStatus.idleState,
    fetchStatus: stateStatus.idleState,
    updateStatus: stateStatus.idleState,
    fetchAllError: null,
    fetchError: null,
    updateError: null
}

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async ({page, size, search, status}: {
        page: number;
        size: number;
        search: string;
        status: string | null;
    }) => {
        const response = await axiosClient.get(orderApi.get, {
                params: {page, size, search, status}
            }
        );
        return response.data;
    }
);

export const fetchOrder = createAsyncThunk(
    'orders/fetchOrder',
    async ({id}: { id?: string | null }) => {
        const response = await axiosClient.get(`${orderApi.get}/${id}`)
        return response.data;
    }
)

export const updateOrder = createAsyncThunk<Order, {
    id: string;
    newStatus: string;
}, {
    rejectValue: { code: number, error: string }
}>(
    'orders/updateOrder',
    async ({id, newStatus}, {rejectWithValue}) => {
        try {
            const response = await axiosClient.patch(`${orderApi.update}/${id}`, {
                newStatus: newStatus
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                return response.data.data;
            } else {
                return rejectWithValue({code: response.status, error: response.data.message});
            }
        } catch (error: any) {
            return rejectWithValue({code: 500, error: error.message || 'Sự cố không xác định'});
        }
    }
)

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrderDetailId: (state, action: PayloadAction<string | null>) => {
            state.detailId = action.payload;
        },
        resetOrderUpdateStatus(state) {
            state.updateStatus = stateStatus.idleState
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        // Quản lý trạng thái cho fetchOrders
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.fetchAllStatus = stateStatus.loadingState;
                state.fetchAllError = null
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.fetchAllStatus = stateStatus.succeededState;
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
                state.orders = action.payload.data || [];
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.fetchAllStatus = stateStatus.failedState;
                state.fetchAllError = action.error.message || 'Failed to fetch orders';
            })

        // Quản lý trạng thái cho fetchOrder
        builder
            .addCase(fetchOrder.pending, (state) => {
                state.fetchStatus = stateStatus.loadingState;
                state.fetchError = null
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.order = action.payload.data || null;
                state.fetchStatus = stateStatus.succeededState;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.fetchStatus = stateStatus.failedState;
                state.fetchError = action.error.message || 'Failed to fetch order';
            });

        // Quản lý trạng thái cho updateOrder
        builder
            .addCase(updateOrder.pending, (state) => {
                state.updateStatus = stateStatus.loadingState;
                state.updateError = null
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) state.orders[index] = action.payload;
                state.updateStatus = stateStatus.succeededState
                state.updateError = null
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.updateStatus = stateStatus.failedState;
                state.updateError = action.payload || {code: 500, error: 'Sự cố không xác định'};
            })
    }
});

export const {
    setOrderDetailId,
    resetOrderUpdateStatus
} = orderSlice.actions;

export default orderSlice.reducer;
