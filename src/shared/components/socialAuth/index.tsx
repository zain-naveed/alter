import { FacebookIcon, GoogleIcon } from "assets";
import styles from "./style.module.scss";
import {
  LoginSocialGoogle,
  LoginSocialFacebook,
  IResolveParams,
} from "reactjs-social-login";
import { FacebookAppId, GoogleAPI } from "shared/utils/endpoints";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { SocialLogin } from "shared/services/authService";
import { toastMessage } from "../toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "shared/redux/reducers/userSlice";
import { setRouteReducer } from "shared/redux/reducers/routeSlice";
import { requestForToken } from "firebase-auth";
import { setNotification } from "shared/redux/reducers/notificationSlice";

const SocialAuthh = () => {
  const { notification } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [gloading, setGloading] = useState<boolean>(false);
  const [fbloading, setFBloading] = useState<boolean>(false);
  const onSuccess = async (data: any, provider: string) => {
    let formData = new FormData();
    if (provider === "google") {
      setGloading(true);
      let username = data.email.split("@")[0];
      let trimUsername = username.replace(/\s/g, "") + new Date().getTime();
      formData.append("first_name", data.given_name);
      formData.append("last_name", data.family_name);
      formData.append("user_name", trimUsername);
      formData.append("email", data.email);
      formData.append("social_network", "0");
      formData.append("social_login_id", data.sub);
      if (data.picture) {
        formData.append("avatar", data.picture);
      }
    } else if (provider === "facebook") {
      setFBloading(true);
      let username = "";
      let trimUsername = "";
      console.log("FB", data);
      if (data?.email) {
        formData.append("email", data.email);
        username = data.email.split("@")[0];
        trimUsername = username.replace(/\s/g, "") + new Date().getTime();
      } else {
        username = data?.name.toLowerCase();
        trimUsername = username.replace(/\s/g, "") + new Date().getTime();
      }

      formData.append("user_name", trimUsername);
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);

      formData.append("social_network", "1");
      formData.append("social_login_id", data.userID);
      if (data.picture) {
        formData.append("avatar", data.picture.data.url);
      }
    }
    let currentToken: any = "";
    if (notification?.permission) {
      currentToken = await requestForToken();
      dispatch(
        setNotification({
          device_id: currentToken,
          fcm_token: currentToken,
        })
      );
      formData.append("device_id", currentToken);
      formData.append("fcm_token", currentToken);
    }
    SocialLogin(formData)
      .then((res) => {
        let resp = {
          isLoggedIn: true,
          user: res.data.data.user,
        };
        dispatch(setUser(resp));
        dispatch(setRouteReducer({ routeType: "private", originScreen: "/" }));
        toastMessage("success", "Logged In!");
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
        toastMessage("Error", err.response.data.message);
      })
      .finally(() => {
        setGloading(false);
        setFBloading(false);
      });
  };

  return (
    <div className="d-flex justify-content-center">
      {!gloading && !fbloading ? (
        <LoginSocialGoogle
          client_id={GoogleAPI}
          scope="openid profile email"
          discoveryDocs="claims_supported"
          cookie_policy="single_host_origin"
          onLoginStart={() => {
            // setGloading(true);
          }}
          onResolve={({ provider, data }: IResolveParams) => {
            onSuccess(data, provider);
          }}
          onReject={(err) => {
            console.log(err);
            setGloading(false);
          }}
        >
          <div className={`${styles.socialIconContainer}`} role={"button"}>
            <GoogleIcon style={{ width: "30px", height: "28px" }} />
          </div>
        </LoginSocialGoogle>
      ) : gloading ? (
        <div className={`${styles.socialIconContainer}`} role={"button"}>
          <Spinner size="sm" animation="border" style={{ color: "#6c5dd3" }} />
        </div>
      ) : (
        <div className={`${styles.socialIconContainer}`} role={"button"}>
          <GoogleIcon style={{ width: "30px", height: "28px" }} />
        </div>
      )}

      {!fbloading && !gloading ? (
        <LoginSocialFacebook
          appId={FacebookAppId}
          onLoginStart={() => {
            // setFBloading(true);
          }}
          fieldsProfile={
            "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender"
          }
          onResolve={({ provider, data }: IResolveParams) => {
            onSuccess(data, provider);
          }}
          onReject={(err) => {
            console.log(err);
            setFBloading(false);
          }}
        >
          <div className={`${styles.socialIconContainer} ms-2`} role={"button"}>
            <FacebookIcon />
          </div>
        </LoginSocialFacebook>
      ) : fbloading ? (
        <div className={`${styles.socialIconContainer} ms-2`} role={"button"}>
          <Spinner size="sm" animation="border" style={{ color: "#6c5dd3" }} />
        </div>
      ) : (
        <div className={`${styles.socialIconContainer} ms-2`} role={"button"}>
          <FacebookIcon />
        </div>
      )}
    </div>
  );
};

export default SocialAuthh;
