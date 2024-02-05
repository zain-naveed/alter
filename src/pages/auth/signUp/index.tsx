import { CameraIcon, defaultAvatar, TickIcon } from "assets";
import classNames from "classnames";
import { Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AuthWrapper from "shared/components/authWrapper";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import CustomPhoneInput from "shared/components/customPhoneInput";
import CustomSelect from "shared/components/customSelect";
import SocialAuthh from "shared/components/socialAuth";
import { toastMessage } from "shared/components/toast";
import { setRouteReducer } from "shared/redux/reducers/routeSlice";
import { setUser } from "shared/redux/reducers/userSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { RegisterUser } from "shared/services/authService";
import { checkFileType } from "shared/utils/helper";
import { SignUpVS } from "shared/utils/validations";
import styles from "./style.module.scss";
import { requestForToken } from "firebase-auth";
import { setNotification } from "shared/redux/reducers/notificationSlice";

interface InitialValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  username: string;
  phonenumber: string;
  dob: string;
  gender: string;
  condition: boolean;
}

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notification } = useSelector((state: any) => state.root);
  const [profileURL, setProfileURL] = useState<string>("");
  const [profileFile, setProfileFile] = useState<any>(null);
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
  ];
  const initialValues: InitialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    username: "",
    phonenumber: "",
    dob: "",
    gender: "",
    condition: false,
  };
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleSignUp = async (values: InitialValues, action: any) => {
    if (values?.condition) {
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
      let genderNum = "0";
      if (values.gender === "Male") {
        genderNum = "0";
      } else if (values.gender === "Female") {
        genderNum = "1";
      }
      if (values.gender === "Others") {
        genderNum = "2";
      }

      formData.append("first_name", values.firstname);
      formData.append("last_name", values.lastname);
      formData.append("user_name", values.username);
      formData.append("email", values.email);
      formData.append("phone", values.phonenumber);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.confirmPassword);
      formData.append("dob", values.dob);
      formData.append("gender", genderNum);

      if (profileFile) {
        formData.append("avatar", profileFile);
      }
      RegisterUser(formData)
        .then((res) => {
          if (res?.data?.data) {
            toastMessage("success", "Otp Sent");
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
                  firstname: values.firstname,
                  lastname: values.lastname,
                  username: values.username,
                  phonenumber: values.phonenumber,
                  password: values.password,
                  dob: values.dob,
                  gender: values.gender,
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
    } else {
      toastMessage("error", "Please accept terms and conditions");
      action.setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | any = e?.target?.files?.[0];
    if (checkFileType(file.type)) {
      let url = URL.createObjectURL(file);
      setProfileFile(file);
      setProfileURL(url);
    } else {
      setProfileFile(null);
      setProfileURL("");
      toastMessage("error", "Only JPG, JPEG, PNG are supported");
    }
  };

  return (
    <AuthWrapper>
      <div
        className={`${styles.signupContainer} row col-xl-7 col-lg-8 col-md-9 col-sm-10 col-12`}
      >
        <label className={`p-0 ${styles.containerTitle} mb-4`}>
          Let's get started
        </label>
        <div className={`position-relative p-0 ${styles.photoContainer}`}>
          <label htmlFor="profilephoto" role={"button"}>
            <img
              src={profileURL ? profileURL : defaultAvatar}
              alt="sign-up-avatar-icon"
              className={`${styles.signAvatarImgStyle}`}
            />

            <div className={`${styles.cameraIconStyleContainer}`}>
              <CameraIcon />
            </div>
          </label>
          <input
            type={"file"}
            name="profilephoto"
            id="profilephoto"
            role="button"
            className={`${styles.proilePhotoInput}`}
            accept="image/*"
            onChange={(e) => {
              handleImageUpload(e);
            }}
          />
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, action) => {
            action.setSubmitting(true);
            handleSignUp(values, action);
          }}
          validationSchema={SignUpVS}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <form
              className="p-0 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="row">
                <div className="col-md-6 ">
                  <CustomInput
                    label="First Name"
                    required
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Enter your first name"
                    error={
                      touched.firstname && errors.firstname
                        ? errors.firstname
                        : ""
                    }
                    onChange={(e: any) => {
                      if (e.target.value?.length < 30) {
                        setFieldValue(
                          "firstname",
                          e.target.value.replace(" ", "")
                        );
                      }
                    }}
                    // onChange={handleChange("firstname")}
                    value={values.firstname}
                  />
                </div>
                <div className="col-md-6">
                  <CustomInput
                    label="Last Name"
                    required
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Enter your last name"
                    error={
                      touched.lastname && errors.lastname ? errors.lastname : ""
                    }
                    onChange={(e: any) => {
                      if (e.target.value?.length < 30) {
                        setFieldValue(
                          "lastname",
                          e.target.value.replace(" ", "")
                        );
                      }
                    }}
                    // onChange={handleChange("lastname")}
                    value={values.lastname}
                  />
                </div>
              </div>
              <CustomInput
                label="Username"
                required
                type="text"
                placeholder="Enter your username"
                disabled={isSubmitting}
                error={
                  touched.username && errors.username ? errors.username : ""
                }
                onChange={(e: any) => {
                  if (e.target.value?.length < 30) {
                    setFieldValue("username", e.target.value);
                  }
                }}
                value={values.username}
              />
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Email"
                    disabled={isSubmitting}
                    required
                    type="email"
                    placeholder="Enter your email"
                    error={touched.email && errors.email ? errors.email : ""}
                    onChange={handleChange("email")}
                    value={values.email}
                  />
                </div>
                <div className="col-md-6">
                  <CustomPhoneInput
                    label="Phone Number"
                    disable={isSubmitting}
                    required
                    error={
                      touched.phonenumber && errors.phonenumber
                        ? errors.phonenumber
                        : ""
                    }
                    value={values.phonenumber}
                    onChange={setFieldValue}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Date of Birth"
                    required
                    disabled={isSubmitting}
                    type="date"
                    error={touched.dob && errors.dob ? errors.dob : ""}
                    onChange={handleChange("dob")}
                    value={values.dob}
                    isDate
                    placeholder="yyyy-mm-dd"
                  />
                </div>
                <div
                  className={classNames(
                    "col-md-6",
                    touched.gender && errors.gender ? "mb-1" : "mb-3"
                  )}
                >
                  <CustomSelect
                    label="Gender"
                    required
                    disabled={isSubmitting}
                    error={touched.gender && errors.gender ? errors.gender : ""}
                    onChangeHandle={(val) => setFieldValue("gender", val)}
                    value={values.gender}
                    selectionColor="#11142d"
                    options={genderOptions}
                    placeholder={"Select your gender"}
                    optionsContainer={styles.optionsContainer}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Password"
                    disabled={isSubmitting}
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
                </div>
                <div className="col-md-6">
                  <CustomInput
                    label="Confirm Password"
                    disabled={isSubmitting}
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
                </div>
              </div>
              <div className="d-flex align-items-center ">
                <div
                  className={` me-1 d-flex justify-content-center align-items-center ${
                    values.condition
                      ? styles.termsCheckBoxActive
                      : styles.termsCheckBox
                  }`}
                  role={"button"}
                  onClick={() => {
                    setFieldValue("condition", !values.condition);
                  }}
                >
                  <TickIcon />
                </div>
                <label className={styles.termsText}>
                  Accept to{" "}
                  <label
                    onClick={() =>
                      window.open(
                        window.location.protocol +
                          "//" +
                          window.location.host +
                          routeConstant.privacy.path
                      )
                    }
                    className={classNames(
                      styles.termsTextHighlighted,
                      "pointer"
                    )}
                  >
                    Privacy Policy
                  </label>{" "}
                  and{" "}
                  <label
                    onClick={() =>
                      window.open(
                        window.location.protocol +
                          "//" +
                          window.location.host +
                          routeConstant.terms.path
                      )
                    }
                    className={classNames(
                      styles.termsTextHighlighted,
                      "pointer"
                    )}
                  >
                    Terms & conditions
                  </label>
                </label>
              </div>
              <div className={classNames("mb-4", styles.termsError)}>
                {errors.condition && touched.condition ? errors.condition : ""}
              </div>

              <CustomButton
                title="Signup"
                submitHandle={handleSubmit}
                isDisable={isSubmitting}
                loading={isSubmitting}
              />
            </form>
          )}
        </Formik>
        <div className={`mb-4 ${styles.divider} mt-4`}>
          <span className={styles.dividerTxt}>or Signup with</span>
        </div>
        <SocialAuthh />
        <label className={`${styles.btmText} mb-4 mt-4`}>
          Already have an account?
          <label
            className={`ms-1 ${styles.highlightBtmText}`}
            onClick={() => {
              navigate("/login");
            }}
          >
            Login Now
          </label>
        </label>
      </div>
    </AuthWrapper>
  );
};

export default SignUp;
