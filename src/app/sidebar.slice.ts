import {createSlice} from "@reduxjs/toolkit";

type SidebarState = {
    showSidebar: boolean;
}

const initialState: SidebarState = {
    showSidebar: true,
};

export const SidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        showSidebar: state => {
            state.showSidebar = true;
        },
        hideSidebar: state => {
            state.showSidebar = false;
        }
    }
});

export const {showSidebar, hideSidebar} = SidebarSlice.actions;

export default SidebarSlice.reducer;
