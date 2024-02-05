import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  user: {},
  isLoggedIn: false,
  guest: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {
    setUser: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetUser: () => initState,
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
