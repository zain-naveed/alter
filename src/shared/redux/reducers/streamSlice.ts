import { createSlice } from "@reduxjs/toolkit";

const initState: {
  streamTitle: string;
  description: string;
  thumbnail: any;
  disableComment: boolean;
  isStarted: boolean;
  streamid: any;
  liveResp: any;
} = {
  streamTitle: "",
  description: "",
  thumbnail: null,
  disableComment: false,
  isStarted: false,
  streamid: 0,
  liveResp: null,
};

export const streamSlice = createSlice({
  name: "stream",
  initialState: initState,
  reducers: {
    setStream: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetStream: () => initState,
  },
});

export const { setStream, resetStream } = streamSlice.actions;

export default streamSlice.reducer;
