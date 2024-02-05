import { Formik } from "formik";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AuthWrapper from "shared/components/authWrapper";
import CustomButton from "shared/components/customButton";
import { toastMessage } from "shared/components/toast";
import { setUser } from "shared/redux/reducers/userSlice";
import {
  SendOtp,
  VerifyOTP,
  VerifyOTPReset,
} from "shared/services/authService";
import { otpVS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface InitialValues {
  otp: string;
}

const OTP = () => {
  const initialValues: InitialValues = {
    otp: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { route, user } = useSelector((state: any) => state.root);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAction = (values: InitialValues, action: any) => {
    if (route?.originScreen === "forgetScreeen") {
      let formData = new FormData();
      formData.append("email", user?.user?.email);
      formData.append("otp", values.otp);
      VerifyOTPReset(formData)
        .then((res) => {
          if (res?.data?.data?.verify) {
            let resp = {
              isLoggedIn: false,
              user: res.data.data.user,
            };
            dispatch(setUser(resp));
            toastMessage("success", "Email Verified");
            navigate("/create-password", {
              state: {
                otp: values.otp,
              },
            });
          } else {
            toastMessage("Error", res?.data?.message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
        })
        .finally(() => {
          action.setSubmitting(false);
        });
    } else {
      let formData = new FormData();
      formData.append("email", user?.user?.email);
      formData.append("otp", values.otp);
      VerifyOTP(formData)
        .then((res) => {
          if (res?.data?.data?.verify) {
            let resp = {
              isLoggedIn: false,
              user: res.data.data.user,
            };
            dispatch(setUser(resp));
            navigate("/success");
          } else {
            toastMessage("Error", res?.data?.message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
        })
        .finally(() => {
          action.setSubmitting(false);
        });
    }
    //api
  };

  const handleResendOtp = () => {
    let formData = new FormData();
    formData.append("email", user?.user?.email);
    setLoading(true);
    SendOtp(formData)
      .then((res) => {
        if (res?.data?.data?.sent === true) {
          toastMessage("success", "Otp Sent to your email.");
        } else {
          toastMessage("Error", res.data.message);
        }
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
        toastMessage("Error", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthWrapper>
      <div
        className={`${styles.emailVerifyContainer} row col-xl-5 col-lg-6 col-md-8 col-sm-10 col-12`}
      >
        <label className={`p-0 ${styles.containerTitle} mb-2`}>
          Verification Code
        </label>
        <label className={`p-0 ${styles.subTitle} mb-3`}>
          Enter 4-digit code we've sent to your email address. Use resend code
          if you didn't recieved any.
        </label>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, action) => {
            action.setSubmitting(true);
            handleAction(values, action);
          }}
          validationSchema={otpVS}
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
              <div className="position-relative">
                <OtpInput
                  containerStyle="w-100 justify-content-between mb-5"
                  inputStyle={styles.otpInputStyle}
                  focusStyle={styles.otpFocusStyle}
                  value={values.otp}
                  onChange={handleChange("otp")}
                  numInputs={4}
                  isInputNum
                />
                <div className="error">
                  {touched.otp && errors.otp ? errors.otp : ""}
                </div>
              </div>

              <div className="mt-4" />
              <CustomButton
                title="Submit"
                submitHandle={handleSubmit}
                isDisable={isSubmitting}
                loading={isSubmitting}
              />
            </form>
          )}
        </Formik>
        <label className={`mt-4 p-0 ${styles.btnTxt}`}>
          Didn’t received code?{" "}
          <label
            className={styles.highlighted}
            role={"button"}
            onClick={handleResendOtp}
          >
            {loading ? <Spinner size="sm" animation="border" /> : "Resend"}
          </label>
        </label>
      </div>
    </AuthWrapper>
  );
};

export default OTP;
