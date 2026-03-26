import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connections",
    initialState: null,
    reducers: {
        setConnections: (state, action) => action.payload,
        removeConnection: (state, action) => {
             // Added this so you can remove a connection (e.g., if unmatching)
             if (!state) return null;
             return state.filter(conn => conn._id !== action.payload);
        }
    }
});

export const { setConnections, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;