import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: {},
        isAdmin: false
    },
    reducers: {
        setUser: (state, action) => {
            if (action.payload.user.role === 'admin') {
                state.isAdmin = true
            }
            state.userData = action.payload.user;
            state.loading = false
        },
        clearUser: (state) => {
            state.userData = {};
            state.isAdmin = false
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state) => state.user.userData;

export default userSlice.reducer;
