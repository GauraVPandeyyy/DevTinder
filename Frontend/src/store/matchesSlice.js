import { createSlice } from "@reduxjs/toolkit";

const matchesSlice = createSlice({
  name: "matches",
  initialState: [],
  reducers: {
    setMatches: (state, action) => action.payload,
    removeMatches: (state, action) => {
      return state.filter((match) => match._id !== action.payload);
    },
  },
});

export const { setMatches, removeMatches } = matchesSlice.actions;
export default matchesSlice.reducer;
