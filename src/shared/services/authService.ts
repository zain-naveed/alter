import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

const LoginUser = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.login, params);
};
const RegisterUser = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.auth.register, params);
};
const VerifyOTP = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.auth.verifyOtp, params);
};
const VerifyOTPReset = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.auth.verifyOtpReset, params);
};
const Logout = (params: any) => {
  return HTTP_CLIENT.post("logout", params);
};
const SendOtp = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.auth.sendOtp, params);
};
const ResetPassword = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.auth.resetPassword, params);
};
const SocialLogin = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.auth.socialLogin, params);
};

export {
  LoginUser,
  RegisterUser,
  VerifyOTP,
  Logout,
  SendOtp,
  ResetPassword,
  SocialLogin,
  VerifyOTPReset,
};
