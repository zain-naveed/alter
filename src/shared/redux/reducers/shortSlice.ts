import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  isMuted: false,
};

export const shortSlice = createSlice({
  name: "short",
  initialState: initState,
  reducers: {
    setShortOptions: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetShortOptions: () => initState,
  },
});

export const { setShortOptions, resetShortOptions } = shortSlice.actions;

export default shortSlice.reducer;
