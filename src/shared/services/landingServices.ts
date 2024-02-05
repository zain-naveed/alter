import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getTerms = () => {
  return HTTP_CLIENT.get(Endpoint.landing.terms);
};
const getPrivacyPolicy = () => {
  return HTTP_CLIENT.get(Endpoint.landing.privacy);
};

export { getTerms, getPrivacyPolicy };
