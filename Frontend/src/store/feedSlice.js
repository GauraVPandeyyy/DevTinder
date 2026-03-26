import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        setFeed: (state, action) => action.payload,
        removeFeed: (state, action) => {
            // FIX: Check if state is actually an array before filtering
            if (!state || !Array.isArray(state)) {
                console.warn("Feed state is not an array:", state);
                return state; 
            }
            // Remove the user from the feed
            return state.filter(user => user._id !== action.payload);
        }
    }
});

export const { setFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;