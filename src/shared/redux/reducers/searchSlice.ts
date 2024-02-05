import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  text: "",
  updated: "0",
};

export const searchSlice = createSlice({
  name: "search",
  initialState: initState,
  reducers: {
    setSearch: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetSearch: () => initState,
  },
});

export const { setSearch, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;
