import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  followings: [],
  base_url: "",
};

export const followingSlice = createSlice({
  name: "followings",
  initialState: initState,
  reducers: {
    setFollowings: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetFollowings: () => initState,
  },
});

export const { setFollowings, resetFollowings } = followingSlice.actions;

export default followingSlice.reducer;
