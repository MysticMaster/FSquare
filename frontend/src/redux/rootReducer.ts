import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice.ts";
import brandReducer from "./reducers/brandSlice.ts";
import categorySlice from "./reducers/categorySlice.ts";
import shoesSlice from "./reducers/shoesSlice.ts";

const rootReducer = combineReducers({
    auth: authReducer,
    brands: brandReducer,
    categories: categorySlice,
    shoes: shoesSlice
});

export default rootReducer;
