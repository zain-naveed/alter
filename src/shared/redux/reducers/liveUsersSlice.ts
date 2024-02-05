import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  users: [],
};

export const liveUsersSlice = createSlice({
  name: "liveUsers",
  initialState: initState,
  reducers: {
    setLiveUsers: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetLiveUsers: () => initState,
  },
});

export const { setLiveUsers, resetLiveUsers } = liveUsersSlice.actions;

export default liveUsersSlice.reducer;
