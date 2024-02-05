import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getStreamerPackages = (userId:string) => {
  return HTTP_CLIENT.get(
    `${Endpoint.package.list}/${userId}`
  );
};
const subscribePackage = (params:any) => {
  const formBody:any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key,value)
  }
  return HTTP_CLIENT.post(
    `${Endpoint.package.subscribePackage}`,
    formBody
  );
};
const cancelSubscription = (params:any) => {
  const formBody:any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key,value)
  }
  return HTTP_CLIENT.post(
    `${Endpoint.package.cancelSubscription}`,
    formBody
  );
};

export { getStreamerPackages,subscribePackage,cancelSubscription };
