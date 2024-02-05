import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

const EditUserProfile = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.setting.editProfile, params);
};

const EditProfilePhoto = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.setting.editAvatarPhoto, params);
};

const EditCoverPhoto = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.setting.editCoverPhoto, params);
};

const ChangePasswordService = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.setting.changePassword, params);
};

const GetUserFollowers = (id: any, skip: any, page: any, search: string) => {
  if (search) {
    return HTTP_CLIENT.get(
      `${Endpoint.setting.getFollower}/${id}/${skip}?page=${page}&search_text=${search}`
    );
  } else {
    return HTTP_CLIENT.get(
      `${Endpoint.setting.getFollower}/${id}/${skip}?page=${page}`
    );
  }
};
const removeFollowers = (params: any) => {
  return HTTP_CLIENT.post(`${Endpoint.setting.removeFollower}`, params);
};
const getDonations = (skip?: any, page?: any) => {
  return HTTP_CLIENT.get(`${Endpoint.setting.getDonation}/${skip}${page}`);
};
const getUserPayment = (page?: any) => {
  return HTTP_CLIENT.get(`${Endpoint.setting.getUserPayments}?page=${page}`);
};
const connectPaypal = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(`${Endpoint.setting.savePaypal}`, formBody);
};
const removePaypal = () => {
  return HTTP_CLIENT.post(`${Endpoint.setting.removePaypal}`);
};
const enbleOrDisbleDonation = () => {
  return HTTP_CLIENT.post(`${Endpoint.setting.enableOrDisbleDontn}`);
};
const checStripeAccount = () => {
  return HTTP_CLIENT.get(`${Endpoint.setting.checkStripeAccount}`);
};
const toggleNotification = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(`${Endpoint.setting.toggleNotification}`, formBody);
};
const disConnectStripe = () => {
  return HTTP_CLIENT.post(`${Endpoint.setting.disconnectStripe}`);
};
const connectAccountToStripe = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(`${Endpoint.setting.createStripeAccount}`, formBody);
};
const addSubscriptoin = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(`${Endpoint.setting.addSubscription}`, formBody);
};
const subscriptionList = () => {
  return HTTP_CLIENT.get(`${Endpoint.setting.getSubscription}`);
};
const listAllSubscription = (page:any) => {
  return HTTP_CLIENT.get(`${Endpoint.setting.listSubscription}?page=${page}`);
};
export {
  EditUserProfile,
  EditProfilePhoto,
  EditCoverPhoto,
  ChangePasswordService,
  GetUserFollowers,
  getUserPayment,
  getDonations,
  connectPaypal,
  removePaypal,
  enbleOrDisbleDonation,
  toggleNotification,
  subscriptionList,
  removeFollowers,
  addSubscriptoin,
  connectAccountToStripe,
  checStripeAccount,
  disConnectStripe,
  listAllSubscription
};
