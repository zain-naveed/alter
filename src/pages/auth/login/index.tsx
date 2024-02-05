import classNames from "classnames";
import { Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AuthWrapper from "shared/components/authWrapper";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import SocialAuthh from "shared/components/socialAuth";
import { toastMessage } from "shared/components/toast";
import { setRouteReducer } from "shared/redux/reducers/routeSlice";
import { setUser } from "shared/redux/reducers/userSlice";
import { LoginUser } from "shared/services/authService";
import { LoginVS } from "shared/utils/validations";

import styles from "./style.module.scss";
import { requestForToken } from "firebase-auth";
import { setNotification } from "shared/redux/reducers/notificationSlice";
import { routeConstant } from "shared/routes/routeConstant";

interface InitialValues {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const { notification } = useSelector((state: any) => state.root);
  const initialValues: InitialValues = {
    email: "",
    password: "",
  };
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogIn = async (values: InitialValues, action: any) => {
    let currentToken: any = "";
    let formData = new FormData();
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
    formData.append("email", values.email);
    formData.append("password", values.password);

    LoginUser(formData)
      .then(({ data: { status, data, message } }) => {
        if (data?.is_logged_in) {
          let resp = {
            isLoggedIn: true,
            user: data?.user,
            guest: false,
          };
          dispatch(setUser(resp));
          dispatch(
            setRouteReducer({ routeType: "private", originScreen: "/" })
          );
          navigate(routeConstant.feed.path);
          toastMessage("success", "Logged In!");
        } else {
          if (data?.is_blocked) {
            toastMessage("Error", message);
          } else if (!data?.user_exists) {
            toastMessage("Error", message);
          } else if (!data?.verify) {
            toastMessage("success", "Please verify your email");
            dispatch(
              setRouteReducer({
                routeType: "protected",
                originScreen: "emailVerification",
              })
            );
            dispatch(
              setUser({
                user: {
                  email: values.email,
                  password: values.password,
                },
              })
            );
            navigate("/otp");
          } else {
            toastMessage("Error", message);
          }
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
        toastMessage("Error", err.response.data.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };

  const handleResetPassword = () => {
    dispatch(
      setRouteReducer({
        routeType: "protected",
        originScreen: "forgetScreeen",
      })
    );
    navigate("/email-verification");
  };

  return (
    <AuthWrapper>
      <div
        className={classNames(
          styles.loginContainer,
          styles.maxWidth,
          "row col-12"
        )}
      >
        <label className={`p-0 ${styles.containerTitle}`}>Welcome Back!</label>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, action) => {
            action.setSubmitting(true);
            handleLogIn(values, action);
          }}
          validationSchema={LoginVS}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              className="p-0 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <CustomInput
                label="Username or Email"
                required
                type="text"
                placeholder="Enter your username or email"
                error={touched.email && errors.email ? errors.email : ""}
                onChange={handleChange("email")}
                value={values.email}
              />

              <CustomInput
                label="Password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                error={
                  touched.password && errors.password ? errors.password : ""
                }
                onChange={handleChange("password")}
                value={values.password}
                setShowPassword={setShowPassword}
                showPassword={showPassword}
                password
              />

              <div
                className={`d-flex justify-content-end mb-4 ${styles.forgetPassText}`}
                onClick={handleResetPassword}
              >
                Forget Password?
              </div>
              <CustomButton
                title="Login"
                submitHandle={handleSubmit}
                isDisable={isSubmitting}
                loading={isSubmitting}
              />
            </form>
          )}
        </Formik>
        <div className={`mb-4 ${styles.divider} mt-4`}>
          <span className={` ${styles.dividerTxt}`}>or Continue with</span>
        </div>
        <SocialAuthh />
        <label className={`${styles.btmText} mt-4`}>
          Don't have an account?
          <label
            className={`ms-1 ${styles.highlightBtmText}`}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Register Now
          </label>
        </label>
      </div>
    </AuthWrapper>
  );
};

export default Login;
