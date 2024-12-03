import {combineReducers} from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice.ts";
import brandSlice from "./reducers/brandSlice.ts";
import categorySlice from "./reducers/categorySlice.ts";
import shoesSlice from "./reducers/shoesSlice.ts";
import classificationSlice from "./reducers/classificationSlice.ts";
import sizeSlice from "./reducers/sizeSlice.ts";
import orderSlice from "./reducers/orderSlice.ts";
import statisticalSlice from "./reducers/statisticalSlice.ts";

const rootReducer = combineReducers({
    auth: authSlice,
    brands: brandSlice,
    categories: categorySlice,
    shoes: shoesSlice,
    classifications: classificationSlice,
    sizes: sizeSlice,
    orders: orderSlice,
    statistical: statisticalSlice,
});

export default rootReducer;
