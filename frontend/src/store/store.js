import { configureStore } from '@reduxjs/toolkit';
import toastReducer from '../slice/ToastSlice';
import userReducer from '../slice/UserSlice';

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        user: userReducer
    }
});