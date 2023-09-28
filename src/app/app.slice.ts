import {createSlice} from "@reduxjs/toolkit";

type AppState = {
    loading: boolean;
}

const initialState: AppState = {
    loading: false,
};

export const AppSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        showIndicator: state => {
            state.loading = true;
        },
        hideIndicator: state => {
            state.loading = false;
        },
    }
});

export const {showIndicator, hideIndicator} = AppSlice.actions;

export default AppSlice.reducer;
