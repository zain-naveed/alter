import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  count: 0,
  device_id: "",
  fcm_token: "",
  permission: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState: initState,
  reducers: {
    setNotification: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetNotification: () => initState,
  },
});

export const { setNotification, resetNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
