import {configureStore} from "@reduxjs/toolkit";
import rootReducer from './rootReducer';
import {setupInterceptors} from "../api/axiosClient.ts";

const store = configureStore({
    reducer: rootReducer
});

setupInterceptors(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;


