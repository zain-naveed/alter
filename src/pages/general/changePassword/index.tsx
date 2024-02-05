import React, { useState } from "react";
import Heading from "shared/components/heading";
import CustomInput from "shared/components/customInput";
import styles from "./style.module.scss";
import { classNames } from "shared/utils/helper";
import { updatePasswordVS } from "shared/utils/validations";
import { Formik } from "formik";
import CustomButton from "shared/components/customButton";
import { useSelector } from "react-redux";
import { ChangePasswordService } from "shared/services/settingsService";
import { toastMessage } from "shared/components/toast";

interface InitialValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function ChangePassword() {
  const { user } = useSelector((state: any) => state.root);
  const [currentPassword, setcurrentPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<boolean>(false);
  const InitialValues: InitialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleChangePass = (values: any, action: any) => {
    let formData = new FormData();
    formData.append("email", user?.user?.email);
    formData.append("current_password", values.currentPassword);
    formData.append("new_password", values.newPassword);
    formData.append("new_password_confirmation", values.confirmPassword);
    ChangePasswordService(formData)
      .then((res) => {
        if (res?.data?.status) {
          if (res?.data?.data?.update) {
            toastMessage("success", "Password Updated Successfully");
          } else {
            toastMessage("Error", res?.data?.message);
          }
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
        action.resetForm();
      });
  };

  return (
    <div className={classNames("text-start py-4")}>
      <Heading title="Change Password" headingStyle={styles.heading} />
      <Formik
        initialValues={InitialValues}
        onSubmit={(values, action) => {
          action.setSubmitting(true);
          handleChangePass(values, action);
        }}
        validationSchema={updatePasswordVS}
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
            onSubmit={(e) => e.preventDefault()}
            className={classNames("row", styles.spaceMargin)}
          >
            <div className="col-12 col-lg-6">
              <CustomInput
                label="Current Password"
                required
                autoComplete="new-password"
                type={currentPassword ? "text" : "password"}
                placeholder="••••••"
                onChange={handleChange("currentPassword")}
                value={values.currentPassword}
                error={
                  touched.currentPassword && errors.currentPassword
                    ? errors.currentPassword
                    : ""
                }
                setShowPassword={setcurrentPassword}
                showPassword={currentPassword}
                password
              />

              <CustomInput
                label="New Password"
                required
                type={newPassword ? "text" : "password"}
                placeholder="••••••"
                onChange={handleChange("newPassword")}
                value={values.newPassword}
                error={
                  touched.newPassword && errors.newPassword
                    ? errors.newPassword
                    : ""
                }
                setShowPassword={setNewPassword}
                showPassword={newPassword}
                password
              />

              <CustomInput
                label="Confirm Password"
                required
                type={confirmPassword ? "text" : "password"}
                placeholder="••••••"
                onChange={handleChange("confirmPassword")}
                value={values.confirmPassword}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : ""
                }
                setShowPassword={setConfirmPassword}
                showPassword={confirmPassword}
                password
              />

              <div className="d-flex justify-content-end">
                <div className="d-flex">
                  <CustomButton
                    title="Cancel"
                    containerStyle={styles.cancel}
                    submitHandle={handleSubmit}
                  />
                  <CustomButton
                    title="Update Password"
                    containerStyle={styles.save}
                    submitHandle={handleSubmit}
                    loading={isSubmitting}
                    isDisable={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

const Spacer = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  return <div className={styles.spaceMargin}>{children}</div>;
};

export default ChangePassword;
