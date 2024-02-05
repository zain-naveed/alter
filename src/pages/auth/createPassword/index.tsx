import { Formik } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import AuthWrapper from "shared/components/authWrapper";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import { toastMessage } from "shared/components/toast";
import { ResetPassword } from "shared/services/authService";
import { createPasswordVS } from "shared/utils/validations";
import styles from "../email-verification/style.module.scss";

interface InitialValues {
  password: string;
  confirmPassword: string;
}

const CreatePassword = () => {
  const initialValues: InitialValues = {
    password: "",
    confirmPassword: "",
  };
  const { user } = useSelector((state: any) => state.root);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const location: any = useLocation();

  const handleAction = (values: InitialValues, action: any) => {
    let formData = new FormData();
    formData.append("email", user?.user?.email);
    formData.append("otp", location?.state?.otp);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.confirmPassword);
    ResetPassword(formData)
      .then(() => {
        navigate("/success");
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message);
        toastMessage("Error", err.response.data.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });

    //api
  };

  return (
    <AuthWrapper>
      <div
        className={`${styles.emailVerifyContainer} row col-xl-10 col-lg-10 col-md-9 col-sm-10 col-12 ${styles.maxWidth}`}
      >
        <label className={`p-0 ${styles.containerTitle}`}>
          Create New Password
        </label>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, action) => {
            action.setSubmitting(true);
            handleAction(values, action);
          }}
          validationSchema={createPasswordVS}
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
                label="New Password"
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

              <CustomInput
                label="Confirm Password"
                required
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••"
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : ""
                }
                onChange={handleChange("confirmPassword")}
                value={values.confirmPassword}
                setShowPassword={setShowConfirmPassword}
                showPassword={showConfirmPassword}
                password
              />

              <div className="mt-5" />
              <CustomButton
                title="Update Password"
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

export default CreatePassword;
