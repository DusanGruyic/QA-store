import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { RESET_APP_STATE } from "./actionTypes"; // Import the global reset action type

// Create a custom entity adapter
const customEntityAdapter = createEntityAdapter();

// Define the initial state using the entity adapter
const initialState = {
    user: null,
    isAuthenticated: false,
    entities: customEntityAdapter.getInitialState(),
};

// Create the auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(RESET_APP_STATE, (state) => {
            // Reset the state to initialState
            return initialState;
        });
        // Optionally handle PURGE if needed
        // builder.addCase(PURGE, (state) => {
        //     console.log('Handling PURGE action in authSlice');
        //     customEntityAdapter.removeAll(state.entities);
        //     state.user = null;
        //     state.isAuthenticated = false;
        // });
    },
});

// Action creator for logging out and purging
export const logoutAndPurge = () => (dispatch) => {
    dispatch(authSlice.actions.logout());
    // dispatch({ type: PURGE });
};

// Export the login action and the reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
