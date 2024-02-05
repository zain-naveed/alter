import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import routeSlice from "./reducers/routeSlice";
import userSlice from "./reducers/userSlice";
import searchSlice from "./reducers/searchSlice";
import streamSlice from "./reducers/streamSlice";
import followingSlice from "./reducers/followingSlice";
import liveUsersSlice from "./reducers/liveUsersSlice";
import socketSlice from "./reducers/socketSlice";
import notificationSlice from "./reducers/notificationSlice";
import shortSlice from "./reducers/shortSlice";
const rootReducer = combineReducers({
  user: userSlice,
  route: routeSlice,
  search: searchSlice,
  stream: streamSlice,
  followings: followingSlice,
  liveUsers: liveUsersSlice,
  streamSocket: socketSlice,
  notification: notificationSlice,
  short: shortSlice,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "user",
    "search",
    "liveUsers",
    "streamSocket",
    "notification",
    "short",
  ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: {
    root: persistedReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);
export { store, persistor };
