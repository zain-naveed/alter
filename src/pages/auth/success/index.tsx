import { MailVerifySuccessIcon, PassChangeSuccessIcon } from "assets";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AuthWrapper from "shared/components/authWrapper";
import CustomButton from "shared/components/customButton";
import { resetRouteReducer } from "shared/redux/reducers/routeSlice";
import { setUser } from "shared/redux/reducers/userSlice";
import styles from "./style.module.scss";
import { routeConstant } from "shared/routes/routeConstant";

const Success = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { route, user } = useSelector((state: any) => state.root);

  const handleSucces = () => {
    if (route?.originScreen === "forgetScreeen") {
      dispatch(resetRouteReducer());
      navigate("/login");
    } else {
      dispatch(resetRouteReducer());
      dispatch(
        setUser({
          ...user,
          isLoggedIn: true,
          guest: false,
        })
      );
      navigate(routeConstant.feed.path);
    }
    //api
  };

  useEffect(() => {
    if (route.originScreen === "forgetScreeen") {
      setTimeout(() => {
        document.title = "Password Updated | Alter";
      }, 200);
    }

    // eslint-disable-next-line
  }, []);
  return (
    <AuthWrapper>
      <div
        className={`${styles.emailVerifyContainer} row ${
          route?.originScreen === "forgetScreeen"
            ? "col-xl-4 col-lg-6 col-md-7 col-sm-8 col-12"
            : "col-xl-5 col-lg-6 col-md-9 col-sm-10 col-12"
        }`}
      >
        <label
          className={`p-0 ${styles.containerTitle} ${styles.successContainerTitle} mb-3`}
        >
          {route?.originScreen === "forgetScreeen"
            ? "Password Updated Successfully"
            : "Email Verified Successfully"}
        </label>
        <label className={`p-0 ${styles.subTitle} mb-3`}>
          {route?.originScreen === "forgetScreeen"
            ? "Your password has been updated succesfully. You can use your new password to login."
            : "Congratulations! Your Email has been verified successfully. You have successfully created your Alter account."}
        </label>
        <div className="d-flex justify-content-center align-items-center">
          {route?.originScreen === "forgetScreeen" ? (
            <PassChangeSuccessIcon className={styles.succesImgStyle} />
          ) : (
            <MailVerifySuccessIcon className={styles.succesImgStyle} />
          )}
        </div>
        <div className="mt-4" />
        <CustomButton
          title={
            route?.originScreen === "forgetScreeen"
              ? "Re-Login with New Password"
              : "Continue"
          }
          submitHandle={handleSucces}
        />
      </div>
    </AuthWrapper>
  );
};

export default Success;
