import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type Account = {
    name: string;
    familyName: string;
    givenName: string;
    email: string;
    username: string;
    roles: string[];
}

const initialState: Account = {
    name: "",
    familyName: "",
    givenName: "",
    email: "",
    username: "",
    roles: [],
}

const AccountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccount: (state, action: PayloadAction<Account>) => {
            state.name = action.payload.name;
            state.familyName = action.payload.familyName;
            state.givenName = action.payload.givenName;
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.roles = action.payload.roles;
        },
        deleteAccount: state => {
            state.name = "";
            state.familyName = "";
            state.givenName = "";
            state.email = "";
            state.username = "";
            state.roles = [];
        }
    }
})

export const {setAccount, deleteAccount} = AccountSlice.actions
export default AccountSlice.reducer
