import axios from "axios";
import { store } from "../redux/store";
import { resetUser } from "../redux/reducers/userSlice";
import { BaseURL } from "./endpoints";
export const HTTP_CLIENT = axios.create({
  baseURL: BaseURL,
});
const setupAxios = () => {
  HTTP_CLIENT.interceptors.request.use(
    (config: any) => {
      const token = store.getState().root?.user?.user?.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      // config.headers["Content-Type"] = `multipart/form-data`;
      return config;
    },
    (err) => Promise.reject(err)
  );
};
HTTP_CLIENT.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err?.response?.status === 401) {
      const { user } = store.getState().root;
      if (user?.user?.token) {
        store.dispatch(resetUser());
        window.location.reload();
      }
    }
    return Promise.reject(err);
  }
);
export const initialConfig = () => {
  setupAxios();
};
initialConfig();
