import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

const startStream = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.stream.start, params);
};
const delStream = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.stream.delStream, params);
};
const updateStream = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.stream.updateStream, params);
};
const trendingStreamers = (skip: any, page: any) => {
  return HTTP_CLIENT.get(
    `${Endpoint.stream.trendingStreamer}/${skip}?page=${page}`
  );
};
const addStreamRectn = (params: any) => {
  const formBody: any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key, value);
  }
  return HTTP_CLIENT.post(`${Endpoint.stream.addStreamReaction}`, formBody);
};

const getStreamDetails = (id: any) => {
  return HTTP_CLIENT.get(`${Endpoint.stream.getStreamDetails}/${id}`);
};

const getStreamComment = (params: any) => {
  return HTTP_CLIENT.get(`${Endpoint.stream.listStreamComment}/${params}`);
};

const getStreamStatus = () => {
  return HTTP_CLIENT.get(`${Endpoint.stream.checkStreamingStatus}`);
};

const delStreamComment = (params: any) => {
  return HTTP_CLIENT.post(`${Endpoint.stream.delStreamComment}`, params);
};

const checkStreamSubscriptionStatus = (params: any) => {
  return HTTP_CLIENT.post(`${Endpoint.stream.hasSubscribeStream}`, params);
};

export {
  updateStream,
  delStream,
  startStream,
  trendingStreamers,
  addStreamRectn,
  getStreamDetails,
  getStreamComment,
  getStreamStatus,
  delStreamComment,
  checkStreamSubscriptionStatus,
};
