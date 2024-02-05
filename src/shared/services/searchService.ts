import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const globalSearch = (page: number, params: any) => {
  return HTTP_CLIENT.post(
    `${Endpoint.search.globalSearch}?page=${page}`,
    params
  );
};

export { globalSearch };
