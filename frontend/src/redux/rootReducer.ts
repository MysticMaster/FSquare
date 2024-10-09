import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice.ts";
import brandReducer from "./reducers/brandSlice.ts";
import categorySlice from "./reducers/categorySlice.ts";

const rootReducer = combineReducers({
    auth: authReducer,
    brands: brandReducer,
    categories: categorySlice
});

export default rootReducer;
