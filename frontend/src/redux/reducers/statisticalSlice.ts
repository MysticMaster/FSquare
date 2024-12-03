import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import stateStatus from "../../utils/stateStatus.ts";
import {statisticalApi} from "../../api/api.ts";

interface Thumbnail {
    url: string;
}

interface Top5 {
    _id: string;
    name: string;
    totalSales: number;
    totalRevenue: number;
    thumbnail: Thumbnail | null;
}

interface StatisticalDay {
    start: string;
    end: string;
    totalSales: number;
    totalRevenue: number;
    totalOrder: number;
}

interface StatisticalYear {
    month: string;
    totalSales: number;
    totalRevenue: number;
}

interface StatisticalState {
    top5: Top5[];
    statisticalDay: StatisticalDay | null;
    statisticalYear: StatisticalYear[] | null;
    fetchTop5Status: string;
    fetchDayStatus: string;
    fetchYearStatus: string;
    fetchTop5Error: string | null;
    fetchDayError: string | null;
    fetchYearError: string | null;
}

const initialState: StatisticalState = {
    top5: [],
    statisticalDay: null,
    statisticalYear: [],
    fetchTop5Status: stateStatus.idleState,
    fetchDayStatus: stateStatus.idleState,
    fetchYearStatus: stateStatus.idleState,
    fetchTop5Error: null,
    fetchDayError: null,
    fetchYearError: null
}

// Fetch Top 5 Best Seller
export const fetchTop5 = createAsyncThunk(
    'statistical/fetchTop5',
    async () => {
        try {
            const response = await axiosClient.get(statisticalApi.getTop5);
            return response.data.data;
        } catch (error: any) {
            throw Error(error.response?.data?.message || 'Failed to fetch Top 5');
        }
    }
);

// Fetch Statistical by Day (Date Range)
export const fetchStatisticalDay = createAsyncThunk(
    'statistical/fetchStatisticalDay',
    async ({start, end}: {
        start: string | null;
        end: string | null;
    }) => {
        try {
            const response = await axiosClient.get(statisticalApi.getDay, {
                params: {start: start, end: end}
            });
            return response.data.data;
        } catch (error: any) {
            throw Error(error.response?.data?.message || 'Failed to fetch daily statistics');
        }
    }
);

// Fetch Statistical by Year
export const fetchStatisticalYear = createAsyncThunk(
    'statistical/fetchStatisticalYear',
    async ({year}: { year: number | null }) => {
        try {
            const response = await axiosClient.get(statisticalApi.getYear, {params: {year}});
            return response.data.data;
        } catch (error: any) {
            throw Error(error.response?.data?.message || 'Failed to fetch yearly statistics');
        }
    }
);

const statisticalSlice = createSlice({
    name: 'statistical',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Top 5
        builder.addCase(fetchTop5.pending, (state) => {
            state.fetchTop5Status = stateStatus.loadingState;
            state.fetchTop5Error = null;
        });
        builder.addCase(fetchTop5.fulfilled, (state, action: PayloadAction<Top5[]>) => {
            state.fetchTop5Status = stateStatus.succeededState;
            state.top5 = action.payload;
        });
        builder.addCase(fetchTop5.rejected, (state, action) => {
            state.fetchTop5Status = stateStatus.failedState;
            state.fetchTop5Error = action.error.message || 'An error occurred';
        });

        // Fetch Statistical Day
        builder.addCase(fetchStatisticalDay.pending, (state) => {
            state.fetchDayStatus = stateStatus.loadingState;
            state.fetchDayError = null;
        });
        builder.addCase(fetchStatisticalDay.fulfilled, (state, action: PayloadAction<StatisticalDay>) => {
            state.fetchDayStatus = stateStatus.succeededState;
            state.statisticalDay = action.payload;
        });
        builder.addCase(fetchStatisticalDay.rejected, (state, action) => {
            state.fetchDayStatus = stateStatus.failedState;
            state.fetchDayError = action.error.message || 'An error occurred';
        });

        // Fetch Statistical Year
        builder.addCase(fetchStatisticalYear.pending, (state) => {
            state.fetchYearStatus = stateStatus.loadingState;
            state.fetchYearError = null;
        });
        builder.addCase(fetchStatisticalYear.fulfilled, (state, action: PayloadAction<StatisticalYear[]>) => {
            state.fetchYearStatus = stateStatus.succeededState;
            state.statisticalYear = action.payload;
        });
        builder.addCase(fetchStatisticalYear.rejected, (state, action) => {
            state.fetchYearStatus = stateStatus.failedState;
            state.fetchYearError = action.error.message || 'An error occurred';
        });
    }
});

export default statisticalSlice.reducer;
