import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AuthWrapper from "shared/components/authWrapper";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import { toastMessage } from "shared/components/toast";
import { setUser } from "shared/redux/reducers/userSlice";
import { SendOtp } from "shared/services/authService";
import { emailVerificationVS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface InitialValues {
  email: string;
}

const EmailVerification = () => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const initialValues: InitialValues = {
    email: user?.email ? user?.email : "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAction = (values: InitialValues, action: any) => {
    let formData = new FormData();
    formData.append("email", values.email);
    SendOtp(formData)
      .then((res) => {
        if (res?.data?.data?.sent === true) {
          toastMessage("success", "Otp Sent to your email.");
          dispatch(
            setUser({
              user: {
                email: values.email,
              },
            })
          );
          navigate("/otp");
        } else {
          toastMessage("Error", res.data.message);
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

  return (
    <AuthWrapper>
      <div
        className={`${styles.emailVerifyContainer} row col-xl-6 col-lg-7 col-md-9 col-sm-10 col-12`}
      >
        <label className={`p-0 ${styles.containerTitle} mb-2`}>
          Email Address
        </label>
        <label className={`p-0 mb-3 ${styles.subTitle}`}>
          Please enter your email address below, we’ll send you a 4-digit code
          to verify your email.
        </label>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, action) => {
            action.setSubmitting(true);
            handleAction(values, action);
          }}
          validationSchema={emailVerificationVS}
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
                label="Email Address"
                required
                type="email"
                placeholder="Enter your email"
                error={touched.email && errors.email ? errors.email : ""}
                onChange={handleChange("email")}
                value={values.email}
              />

              <div className="mt-4" />
              <CustomButton
                title="Send Code"
                submitHandle={handleSubmit}
                isDisable={isSubmitting}
                loading={isSubmitting}
              />
            </form>
          )}
        </Formik>
      </div>
    </AuthWrapper>
  );
};

export default EmailVerification;
