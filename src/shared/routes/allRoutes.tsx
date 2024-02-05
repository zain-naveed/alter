import CreatePassword from "pages/auth/createPassword";
import EmailVerification from "pages/auth/email-verification";
import Login from "pages/auth/login";
import OTP from "pages/auth/otp";
import SignUp from "pages/auth/signUp";
import Success from "pages/auth/success";
import UploadShort from "pages/general/uploadShort";
import Feed from "pages/general/feed";
import Following from "pages/general/following";
import Profile from "pages/general/profile";
import Search from "pages/general/search";
import Shorts from "pages/general/shorts";
import StreamDetail from "pages/general/streamDetail";
import Settings from "pages/general/settings";
import Landing from "pages/general/landing";
import Privacy from "pages/general/privacy";
import Terms from "pages/general/terms";
import { routeConstant } from "./routeConstant";
import StartStream from "pages/general/startStream";
import StreamDashBoard from "pages/general/streamDashboard";
import ShortDetail from "pages/general/shortDetail";
import ShareShortDetail from "pages/general/shareShortDetail";

const publicRoute = [
  {
    path: routeConstant.login.path,
    title: routeConstant.login.title,
    Component: Login,
  },
  {
    path: routeConstant.signup.path,
    title: routeConstant.signup.title,
    Component: SignUp,
  },
  {
    path: routeConstant.landing.path,
    title: routeConstant.landing.title,
    Component: Landing,
  },
  {
    path: routeConstant.privacy.path,
    title: routeConstant.privacy.title,
    Component: Privacy,
  },
  {
    path: routeConstant.terms.path,
    title: routeConstant.terms.title,
    Component: Terms,
  },
  {
    path: routeConstant.shareShortDetail.path,
    title: routeConstant.shareShortDetail.title,
    Component: ShareShortDetail,
  },
  {
    path: routeConstant.streamDetail.path,
    title: routeConstant.streamDetail.title,
    Component: StreamDetail,
  },
];
const protectedRoute = [
  {
    path: routeConstant.terms.path,
    title: routeConstant.terms.title,
    Component: Terms,
  },
  {
    path: routeConstant.privacy.path,
    title: routeConstant.privacy.title,
    Component: Privacy,
  },
  {
    path: routeConstant.landing.path,
    title: routeConstant.landing.title,
    Component: Landing,
  },
  {
    path: routeConstant.login.path,
    title: routeConstant.login.title,
    Component: Login,
  },
  {
    path: routeConstant.signup.path,
    title: routeConstant.signup.title,
    Component: SignUp,
  },
  {
    path: routeConstant.emailVerification.path,
    title: routeConstant.emailVerification.title,
    Component: EmailVerification,
  },
  {
    path: routeConstant.otp.path,
    title: routeConstant.otp.title,
    Component: OTP,
  },
  {
    path: routeConstant.createPassword.path,
    title: routeConstant.createPassword.title,
    Component: CreatePassword,
  },
  {
    path: routeConstant.success.path,
    title: routeConstant.success.title,
    Component: Success,
  },
  {
    path: routeConstant.shareShortDetail.path,
    title: routeConstant.shareShortDetail.title,
    Component: ShareShortDetail,
  },
];

const guestRoute = [
  ...publicRoute,
  {
    path: routeConstant.home.path,
    title: routeConstant.home.title,
    Component: Shorts,
  },
  {
    path: routeConstant.feed.path,
    title: routeConstant.feed.title,
    Component: Feed,
  },
  {
    path: routeConstant.profile.path,
    title: routeConstant.profile.title,
    Component: Profile,
  },
  {
    path: routeConstant.streamDetail.path,
    title: routeConstant.streamDetail.title,
    Component: StreamDetail,
  },
  {
    path: routeConstant.shortDetail.path,
    title: routeConstant.shortDetail.title,
    Component: ShortDetail,
  },
  {
    path: routeConstant.shareShortDetail.path,
    title: routeConstant.shareShortDetail.title,
    Component: ShareShortDetail,
  },
  {
    path: routeConstant.search.path,
    title: routeConstant.search.title,
    Component: Search,
  },
];
const privateRoute = [
  {
    path: routeConstant.home.path,
    title: routeConstant.home.title,
    Component: Shorts,
  },
  {
    path: routeConstant.feed.path,
    title: routeConstant.feed.title,
    Component: Feed,
  },
  {
    path: routeConstant.profile.path,
    title: routeConstant.profile.title,
    Component: Profile,
  },
  {
    path: routeConstant.following.path,
    title: routeConstant.following.title,
    Component: Following,
  },
  {
    path: routeConstant.uploadShort.path,
    title: routeConstant.uploadShort.title,
    Component: UploadShort,
  },
  {
    path: routeConstant.startSream.path,
    title: routeConstant.startSream.title,
    Component: StartStream,
  },
  {
    path: routeConstant.streamDashBoard.path,
    title: routeConstant.streamDashBoard.title,
    Component: StreamDashBoard,
  },
  {
    path: routeConstant.streamDetail.path,
    title: routeConstant.streamDetail.title,
    Component: StreamDetail,
  },
  {
    path: routeConstant.shortDetail.path,
    title: routeConstant.shortDetail.title,
    Component: ShortDetail,
  },
  {
    path: routeConstant.shareShortDetail.path,
    title: routeConstant.shareShortDetail.title,
    Component: ShareShortDetail,
  },
  {
    path: routeConstant.search.path,
    title: routeConstant.search.title,
    Component: Search,
  },
  {
    path: routeConstant.setting.path,
    title: routeConstant.setting.title,
    Component: Settings,
  },
];

export { publicRoute, privateRoute, routeConstant, protectedRoute, guestRoute };
