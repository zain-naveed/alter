import * as yup from "yup";

const passwordRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+=-^%])[A-Za-z\d@$!%*?&#+=-^%]{8,}$/;
const specialREgex = /^[a-zA-Z0-9äöüÄÖÜ_]*$/;

const LoginVS = yup.object().shape({
  email: yup.string().required("Username or Email is Required").label("email"),
  password: yup.string().required("Password is Required").label("password"),
});

const SignUpVS = yup.object().shape({
  username: yup
    .string()
    .required("Username is Required")
    .label("username")
    .matches(specialREgex, "Special Characters are not allowed, use _ only"),

  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
  firstname: yup.string().required("First name is Required").label("firstname"),
  lastname: yup.string().required("Last name is Required").label("lastname"),
  phonenumber: yup
    .string()
    .min(7, "Phone Number Must At least 7 digits")
    .max(15, "Phone Number Must be less or equal 15 digits")
    .required("Phone Number is Required")
    .label("phonenumber"),
  password: yup
    .string()
    .required("Password is Required")
    .min(8, "Password too Short")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .min(8, "Password too Short")
    .label("confirmPassword"),
  dob: yup.string().required("Date of Birth is Required").label("dob"),
  gender: yup.string().required("Gender is Required").label("gender"),
  condition: yup
    .boolean()
    .oneOf([true], "Please accept terms & conditions.")
    .label("condition"),
});
const editProfileVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  phonenumber: yup
    .string()
    .required("Phone Number is Required")
    .label("phonenumber"),
  dob: yup.string().required("Date of Birth is Required").label("dob"),
  gender: yup.string().required("Gender is Required").label("gender"),
  bio: yup.string().optional().label("bio"),
});

const emailVerificationVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
});
const updatePasswordVS = yup.object().shape({
  currentPassword: yup.string().required("Current Password is Required"),
  newPassword: yup
    .string()
    .required("Password is Required")
    .min(8, "Password too Short")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .min(8, "Password too Short")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    )
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .label("confirmPassword"),
});
const otpVS = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is Required")
    .min(4, "OTP must be at least 4 characters")
    .label("otp"),
});

const createPasswordVS = yup.object().shape({
  password: yup
    .string()
    .required("Password is Required")
    .min(8, "Password too Short")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .label("confirmPassword"),
});
const SUPPORTED_VIDEO_FORMATS = ["video/mp4", "video/x-m4v", "video/*"];
const createShortVS = yup.object().shape({
  title: yup.string().required("Short Title is required!").label("title"),
  description: yup
    .string()
    .required("Short Description is required!")
    .label("description"),
  video: yup
    .mixed()
    .test("type", "Video is required", (value) =>
      SUPPORTED_VIDEO_FORMATS.includes(value.type)
    ),
});
const editShortVS = yup.object().shape({
  title: yup.string().required("Short Title is required!").label("title"),
  description: yup
    .string()
    .required("Short Description is required!")
    .label("description"),
});
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const streamThumbnailVS = yup.object().shape({
  streamTitle: yup
    .string()
    .required("Stream Title is required!")
    .label("title"),
  description: yup
    .string()
    .required("Stream Description is required!")
    .label("description"),
  thumbnail: yup
    .mixed()
    .test(
      "type",
      "Thumbnail is required. Only JPG, JPEG, PNG are supported",
      (value) => SUPPORTED_FORMATS.includes(value.type)
    ),
  disableComment: yup.boolean().notRequired().label("disableComment"),
});
const subPriceVS = yup.object().shape({
  subPrice: yup
    .number()
    .min(1, "Price Should be Greater Than 0")
    .required("Price is Required")
    .label("subPrice"),
  // adminFee: yup.boolean().required("Please checked the check mark").label("adminFee")
  adminFee: yup
    .boolean()
    .oneOf([true], "Admin Fee is required!!")
    .label("adminFee"),
});

const editStreamVS = yup.object().shape({
  streamTitle: yup
    .string()
    .required("Stream Title is required!")
    .label("title"),
  description: yup
    .string()
    .required("Stream Description is required!")
    .label("description"),
});
const addCardVS = yup.object().shape({
  cardHolderName: yup
    .string()
    .required("Card Holder Name is required!")
    .label("title"),
  number: yup
    .string()
    .required("Card Number is required!")
    .label("description"),
  expiry: yup
    .string()
    .required("Card Expiry Date is required!")
    .label("description"),
  code: yup.string().required("Card CSV/CVV is required!").label("description"),
});

export {
  LoginVS,
  SignUpVS,
  emailVerificationVS,
  otpVS,
  createPasswordVS,
  streamThumbnailVS,
  editProfileVS,
  updatePasswordVS,
  createShortVS,
  editStreamVS,
  addCardVS,
  subPriceVS,
  editShortVS,
};
