import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeStep: 1,
};

export const activeStepSlice = createSlice({
    name: "activeStep",
    initialState,
    reducers: {
        setActiveStep: (state, action) => {
            state = action.payload;

            return state;
        },
    },
});

export const { setActiveStep } = activeStepSlice.actions;

export default activeStepSlice.reducer;
export const selectActiveStep = (state) => state.activeStep;
