import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

const notificationList = (query?: any,page?: number, skip?: number) => {
    // /${skip}${query?'/'+query:""}?page=${page}
  return HTTP_CLIENT.get(`${Endpoint.notification.list}`);
};
const notificationCount = (query?: any,page?: number, skip?: number) => {
    // /${skip}${query?'/'+query:""}?page=${page}
  return HTTP_CLIENT.get(`${Endpoint.notification.notificationCount}`);
};
export { notificationList,notificationCount };