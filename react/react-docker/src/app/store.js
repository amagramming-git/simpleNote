import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import noteReducer from "../features/noteSlice";

export default configureStore({
    reducer: {
        auth: authReducer,
        note: noteReducer,
    },
});