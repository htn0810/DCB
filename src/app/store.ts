import {configureStore} from "@reduxjs/toolkit";
import AppSlice from "./app.slice";
import AccountSlice from "./account.slice";
import SidebarSlice from './sidebar.slice';

const store = configureStore({
    reducer: {
        app: AppSlice,
        account: AccountSlice,
        sidebar: SidebarSlice
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;
