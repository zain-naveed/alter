import React, { useState } from "react";
import { HomeLogo, PrivacyHeader } from "assets";
import { classNames } from "shared/utils/helper";
import CustomButton from "shared/components/customButton";
import styles from "./style.module.scss";
import { useNavigate } from "react-router";
import Heading from "shared/components/heading";
import { routeConstant } from "shared/routes/routeConstant";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "shared/services/authService";
import { setRouteReducer } from "shared/redux/reducers/routeSlice";
import { setUser } from "shared/redux/reducers/userSlice";
import { toastMessage } from "../toast";
interface Props {
  headerTitle: string;
}

function PivacyHeaders(props: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useSelector((state: any) => state.root);

  const handleLogIn = async () => {
    if (user?.guest) {
      navigate(routeConstant.feed.path);
    } else {
      setLoading(true);
      let formData = new FormData();
      formData.append("email", "guest_user");
      formData.append("password", "guest_user");

      LoginUser(formData)
        .then(({ data: { status, data, message } }) => {
          if (status) {
            let resp = {
              isLoggedIn: true,
              user: data?.user,
              guest: true,
            };
            dispatch(setUser(resp));
            dispatch(
              setRouteReducer({ routeType: "guest", originScreen: "/" })
            );
            navigate(routeConstant.feed.path);
          } else {
            toastMessage("Error", message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const { headerTitle } = props;

  return (
    <>
      <img
        src={PrivacyHeader}
        className={classNames(styles.header_cover)}
        alt="landing-bg"
      />
      <div className={styles.header_container}>
        <div className={classNames("container", styles.header)}>
          <div
            className={classNames(
              "d-flex justify-content-between align-items-center",
              styles.nav_margin
            )}
          >
            <HomeLogo
              className={classNames(styles.logo, "pointer")}
              onClick={() => navigate(routeConstant.default.path)}
            />
            <div className={classNames("d-flex gap-2")}>
              <CustomButton
                title="Home"
                submitHandle={handleLogIn}
                containerStyle={styles.guestButton}
                loading={loading}
                isDisable={loading}
                spinnerColor="#ff754c"
              />
              <CustomButton
                title="Register Now"
                submitHandle={() => {
                  navigate(routeConstant.signup.path);
                }}
                containerStyle={styles.signupButton}
              />
            </div>
          </div>
          <div className={styles.headerContent}>
            <Heading title={headerTitle} headingStyle={styles.header_heading} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PivacyHeaders;
