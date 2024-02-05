import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

const addDonation = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.paymentORdonation.addDonation, params);
};
export{
    addDonation
}