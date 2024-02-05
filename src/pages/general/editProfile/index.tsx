import {
  CameraIcon,
  defaultAvatar,
  profileCoverPlaceholder,
  UploadCover,
} from "assets";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import CustomButton from "shared/components/customButton";
import CustomInput from "shared/components/customInput";
import CustomPhoneInput from "shared/components/customPhoneInput";
import CustomSelect from "shared/components/customSelect";
import Cropper from "shared/modal/croper";
import { checkFileType, classNames } from "shared/utils/helper";
import { editProfileVS } from "shared/utils/validations";
import CustomTextArea from "shared/components/customTextArea";
import styles from "./style.module.scss";
import {
  EditProfilePhoto,
  EditUserProfile,
} from "shared/services/settingsService";
import { toastMessage } from "shared/components/toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";
import { setUser } from "shared/redux/reducers/userSlice";
interface Props {}
interface InitialValues {
  email: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  dob: string;
  gender: string;
  bio: string;
}
const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

function EditProfile(props: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.root);
  const initialValues: InitialValues = {
    email: user?.user?.email ? user?.user?.email : "",
    firstname: user?.user?.first_name ? user?.user?.first_name : "",
    lastname: user?.user?.last_name ? user?.user?.last_name : "",
    phonenumber: user?.user?.phone ? user?.user?.phone : "",
    dob: user?.user?.dob ? user?.user?.dob : "",
    gender:
      user?.user?.gender === 0
        ? "Male"
        : user?.user?.gender === 1
        ? "Female"
        : user?.user?.gender === 2
        ? "Others"
        : "",
    bio: user?.user?.bio ? user?.user?.bio : "",
  };

  const [coverPic, setcoverPic] = useState<string>("");
  const [saveCoverPic, setsaveCoverPic] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);

  // showCropper()
  const handleClose = () => setShowModal(!showModal);
  const showCropper = () => setShowModal(true);

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | any = e?.target?.files?.[0];
    if (checkFileType(file.type)) {
      let url = URL.createObjectURL(file);
      setcoverPic(url);
      showCropper();
    } else {
      setcoverPic("");
      toastMessage("error", "Only JPG, JPEG, PNG are supported");
    }
  };

  let cropImagStyle: any = {};
  // if (saveCoverPic) {
  //   cropImagStyle[
  //     "backgroundImage"
  //   ] = `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url(${saveCoverPic})`;
  // } else if (user?.user?.cover_photo) {
  //   cropImagStyle[
  //     "backgroundImage"
  //   ] = `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url(${
  //     user?.user?.base_url + user?.user?.cover_photo
  //   })`;
  // }
  const handleEditUser = (values: InitialValues, action: any) => {
    let genderNum = "0";
    if (values.gender === "Male") {
      genderNum = "0";
    } else if (values.gender === "Female") {
      genderNum = "1";
    }
    if (values.gender === "Others") {
      genderNum = "2";
    }
    let formData = new FormData();
    formData.append("first_name", values.firstname);
    formData.append("last_name", values.lastname);
    formData.append("phone", values.phonenumber);
    formData.append("email", values.email);
    formData.append("dob", values.dob);
    formData.append("gender", genderNum);
    formData.append("bio", values.bio);
    EditUserProfile(formData)
      .then((res) => {
        if (res?.data?.status) {
          let userObj = {
            ...res?.data?.data?.user,
            token: user?.user?.token,
          };
          let resp = {
            user: userObj,
            isLoggedIn: true,
          };
          dispatch(setUser(resp));
          toastMessage("success", "Profile Updated Successfully");
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
  };

  return (
    <div className="container">
      <input
        type={"file"}
        name="coverPhoto"
        id="coverPhoto"
        onChange={handleCoverFile}
        role="button"
        accept="image/*"
        className={`${styles.proilePhotoInput}`}
      />

      <div
        className={classNames(styles.cover_container, "mt-4")}
        style={cropImagStyle}
      >
        <img
          src={
            saveCoverPic
              ? saveCoverPic
              : user?.user?.cover_photo
              ? user?.user?.base_url + user?.user?.cover_photo
              : profileCoverPlaceholder
          }
          className={classNames(styles.cover_img)}
        />
        {user?.user?.cover_photo ? (
          <div className={styles.button_container}>
            <label htmlFor="coverPhoto" className={styles.button_style}>
              <UploadCover />
              <span>Change Cover Photo</span>
            </label>
          </div>
        ) : (
          <div className={styles.button_container}>
            <label
              htmlFor="coverPhoto"
              className={styles.button_style_condition}
            >
              <UploadCover />
              <span>Change Cover Photo</span>
            </label>
          </div>
        )}

        <AvatarUpload />
      </div>
      <div className={classNames(styles.text_left)}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, action) => {
            action.setSubmitting(true);
            handleEditUser(values, action);
          }}
          validationSchema={editProfileVS}
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
              className="p-0 mt-4 pb-4"
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
                    placeholder="Enter your first name"
                    error={
                      touched.firstname && errors.firstname
                        ? errors.firstname
                        : ""
                    }
                    onChange={handleChange("firstname")}
                    value={values.firstname}
                  />
                </div>
                <div className="col-md-6">
                  <CustomInput
                    label="Last Name"
                    required
                    type="text"
                    placeholder="Enter your last name"
                    error={
                      touched.lastname && errors.lastname ? errors.lastname : ""
                    }
                    onChange={handleChange("lastname")}
                    value={values.lastname}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    error={touched.email && errors.email ? errors.email : ""}
                    onChange={handleChange("email")}
                    value={values.email}
                    disabled={user?.user?.email ? true : false}
                  />
                </div>
                <div className="col-md-6">
                  <CustomPhoneInput
                    label="Phone Number"
                    error={
                      touched.phonenumber && errors.phonenumber
                        ? errors.phonenumber
                        : ""
                    }
                    required
                    value={values.phonenumber}
                    onChange={setFieldValue}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Date of Birth"
                    type="date"
                    required
                    error={touched.dob && errors.dob ? errors.dob : ""}
                    onChange={handleChange("dob")}
                    value={values.dob}
                    isDate
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div className="col-md-6  mb-3">
                  <CustomSelect
                    label="Gender"
                    disabled={isSubmitting}
                    required
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
              <CustomTextArea
                label="My Bio"
                // required
                row={5}
                value={values.bio}
                onChange={handleChange("bio")}
                error={touched.bio && errors.bio ? errors.bio : ""}
                placeholder="Bio"
              />
              <div className="d-flex justify-content-end">
                <div className="d-flex">
                  <CustomButton
                    title="Cancel"
                    containerStyle={styles.cancel}
                    submitHandle={() => {
                      navigate(routeConstant.default.path);
                    }}
                  />
                  <CustomButton
                    title="Save Change"
                    containerStyle={styles.save}
                    submitHandle={handleSubmit}
                    loading={isSubmitting}
                    isDisable={isSubmitting}
                  />
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <Cropper
        show={showModal}
        handleClose={handleClose}
        coverPic={coverPic}
        setSaveCoverPic={setsaveCoverPic}
      />
    </div>
  );
}
const AvatarUpload = () => {
  const dispatch = useDispatch();
  const [profileURL, setProfileURL] = useState<string>("");
  const { user } = useSelector((state: any) => state.root);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | any = e?.target?.files?.[0];
    if (checkFileType(file.type)) {
      let url = URL.createObjectURL(file);
      setProfileURL(url);
      let formData = new FormData();
      formData.append("image", file);
      EditProfilePhoto(formData)
        .then((res) => {
          if (res?.data?.status) {
            let userObj = {
              ...res?.data?.data?.user,
              token: user?.user?.token,
            };
            let resp = {
              user: userObj,
              isLoggedIn: true,
            };
            dispatch(setUser(resp));
            toastMessage("success", "Profile Photo Updated");
          } else {
            toastMessage("Error", res?.data?.message);
          }
        })
        .catch((err) => {
          console.log("ERR", err.response.data.message);
          toastMessage("Error", err.response.data.message);
        })
        .finally(() => {});
    } else {
      toastMessage("error", "Only JPG, JPEG, PNG are supported");
      setProfileURL("");
    }
  };

  return (
    <div
      className={`p-0 ${styles.photoContainer} ${styles.avatar}`}
      role={"button"}
    >
      <label htmlFor="profilephoto" role={"button"}>
        {user?.user?.avatar || profileURL ? (
          <img
            src={
              profileURL
                ? profileURL
                : user?.user?.social_login_id
                ? user?.user?.avatar
                : user?.user?.base_url + user?.user?.avatar
            }
            alt="sign-up-avatar-icon"
            className={`${styles.signAvatarImgStyle}`}
          />
        ) : (
          <img
            src={defaultAvatar}
            alt="sign-up-avatar-icon"
            className={`${styles.signAvatarImgStyle}`}
          />
        )}

        <div className={`${styles.cameraIconStyleContainer}`} role={"button"}>
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
  );
};

export default EditProfile;
