import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "requests",
    initialState: null,
    reducers: {
        setRequests: (state, action) => action.payload,
        removeRequest: (state, action) => {
            return state.filter(req => req._id !== action.payload);
        }
    }
});

export const { setRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;