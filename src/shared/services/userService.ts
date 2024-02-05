import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

 const GetUserProfile = () => {
  return HTTP_CLIENT.get(Endpoint.user.getProfile);
};

 const GetPublicUserProfile = (params: string | any) => {
  return HTTP_CLIENT.get(`${Endpoint.user.getPublicProfile}/${params}`);
};

 const FollowUser = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.user.follow, params);
};

 const UnFollowUser = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.user.unFollow, params);
};

 const GetUserFollowing = (
  id: any,
  skip: any,
  page: any,
  search: string
) => {
  if (search) {
    return HTTP_CLIENT.get(
      `${Endpoint.user.getFollowing}/${id}/${skip}?page=${page}&search_text=${search}`
    );
  } else {
    return HTTP_CLIENT.get(
      `${Endpoint.user.getFollowing}/${id}/${skip}?page=${page}`
    );
  }
};
 const GetProfileShort = (params:any)=>{
  return HTTP_CLIENT.get(`${Endpoint.user.profileShort}${params}`);
}
 const DelProfileShort = (params:any)=>{
  return HTTP_CLIENT.post(`${Endpoint.user.deleteProfileShort}`,params);
}
export {
  GetProfileShort,
  GetUserFollowing,
  UnFollowUser,
  GetUserProfile,
  GetPublicUserProfile,
  FollowUser,
  DelProfileShort
}
