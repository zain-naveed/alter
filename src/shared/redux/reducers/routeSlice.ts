import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  routeType: "public",
  originScreen: "/",
};

export const routeSlice = createSlice({
  name: "route",
  initialState: initState,
  reducers: {
    setRouteReducer: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetRouteReducer: () => initState,
  },
});

export const { setRouteReducer, resetRouteReducer } = routeSlice.actions;

export default routeSlice.reducer;
