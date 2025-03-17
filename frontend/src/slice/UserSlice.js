import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name: 'user',
    initialState: {Email : '', isAuth: false},  //TODO removed the hardcode
    reducers:{
        userdetail:(state, action) => {
            console.log(action.payload);
            state.Email = action.payload
        },
        authentication:(state, action) => {
            state.isAuth = action.payload
        }
    }
});

export const { userdetail } = UserSlice.actions;
export const userSelects = (state) => state.user;
export default UserSlice.reducer;