import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

const feedShort = (query: any, page: number, skip: number) => {
  return HTTP_CLIENT.get(
    `${Endpoint.feed.feedShort}/${skip}${query ? "/" + query : ""}?page=${page}`
  );
};
const recentStream = (id: string, skip?: number, query?: any) => {
  return HTTP_CLIENT.get(
    `${Endpoint.feed.recentStream}/${id}/${skip}/${query}`
  );
};
const getLiveStream = (limit: number, query?: any, page?: number) => {
  return HTTP_CLIENT.get(
    `${Endpoint.feed.getLiveStream}/${limit}/${query}${
      page ? "?page=" + page : ""
    }`
  );
};
const getUserLiveStream = (limit: number, query?: any, page?: number) => {
  return HTTP_CLIENT.get(
    `${Endpoint.feed.getUserLiveStream}/${limit}/${query}${
      page ? "?page=" + page : ""
    }`
  );
};

const getTopStreamers = (id: string, page: number, skip: number) => {
  return HTTP_CLIENT.get(
    `${Endpoint.feed.topStreamers}/${id}/${skip}?page=${page}`
  );
};
const getTopUserFollowers = (id: string, page: number, skip: number) => {
  return HTTP_CLIENT.get(
    `${Endpoint.feed.topFollowers}/${id}/${skip}?page=${page}`
  );
};

export {
  feedShort,
  recentStream,
  getTopStreamers,
  getLiveStream,
  getUserLiveStream,
  getTopUserFollowers,
};
