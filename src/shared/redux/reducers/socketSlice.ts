import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "streamSocket",
  initialState: initState,
  reducers: {
    setStreamSocket: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetStreamSocket: () => initState,
  },
});

export const { setStreamSocket, resetStreamSocket } = socketSlice.actions;

export default socketSlice.reducer;
