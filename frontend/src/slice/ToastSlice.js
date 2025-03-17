import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    toasts:[],
};

const Toastslice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showToast:(state, action) => {
            const { id, isOpen, message, color } = action.payload;
            const exists = state.toasts.some(toast => toast.id === id)
            if(!exists){
                state.toasts.push({
                    id,
                    isOpen,
                    message,
                    color,
                    index: 1
                })
            }else {
                state.toasts = state.toasts.filter(toast => toast.id !== id);
                state.toasts.push({
                    id,
                    isOpen,
                    message,
                    color,
                    index: 1
                })
            }
        },

        hideToast(state, action){
            const toastId = action.payload.id;
            state.toasts = state.toasts.map((toast) =>
                toast.id === toastId ? { ...toast, isOpen: false } : toast
            );
        }
    }
});

export const { showToast, hideToast } = Toastslice.actions;

export default Toastslice.reducer;