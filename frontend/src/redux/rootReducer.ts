import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice.ts";
import brandReducer from "./reducers/brandSlice.ts";

const rootReducer = combineReducers({
    auth: authReducer,
    brands: brandReducer,
});

export default rootReducer;
