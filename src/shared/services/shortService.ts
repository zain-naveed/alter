import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

const uploadShort = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(Endpoint.short.uploadShort, formBody);
};
const updateShorts = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(Endpoint.short.updateShort, formBody);
};
const shortDetails = (params: any) => {
  return HTTP_CLIENT.get(`${Endpoint.short.shortDetail + "/" + params}`);
};
const addShortComment = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(Endpoint.short.addShortComment, formBody);
};
const getShortComment = (params: any) => {
  return HTTP_CLIENT.get(`${Endpoint.short.listShortComment}/${params}`);
};
const updateShortComment = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(`${Endpoint.short.updateShortComment}`, formBody);
};
const delShortComment = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(`${Endpoint.short.delShortComment}`, formBody);
};
const addShortRectn = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(`${Endpoint.short.addShortReaction}`, formBody);
};
const delShortRectn = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(`${Endpoint.short.delShortReaction}`, formBody);
};
export {
  uploadShort,
  updateShorts,
  shortDetails,
  getShortComment,
  addShortComment,
  updateShortComment,
  delShortComment,
  addShortRectn,
  delShortRectn,
};
