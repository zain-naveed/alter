const BaseURL = "https://admin.alter.tv/api/";
const SocketURL = "https://admin.alter.tv:5504";

// const BaseURL = "https://devcp.codingpixels.us/new/alter/api/";
// const SocketURL = "https://dev.upworkdeveloper.com:5504";

//Social Auth URLs
const GoogleAPI =
  "397153300449-36orlntv3tk4lkoo435odsb0n7f6jok8.apps.googleusercontent.com";
const FacebookAppId = "9311056308936371";

// stripe keys
const stripePublicKey =
  "pk_test_51N25u1Az9nogvZOrMavwMELN17JyZAHTyYfg425Onmxm9UtLx54bW7SpB5Dz7dgIyxYOGGEnFWxD5wg9F57mNJG200ED7ckGD6";

//Paypal URLS
const PaypalClientId =
  "ASwO61Xrml0LggVNAmZ5KvCsJH_uU1a3xEPvMyfESmDwidPSakzsMtDmr1LEj4Sc8bf5YaLArQ4pCq1H";
const PaypalSecret =
  "ENlfLZAylT9X8XE0kK07tb2dM1Z3WGgY51BdLDX5yFgpHkpbR_inZUyR3GSeBNwp756KIE0KSw9hHgFy";

//StreamingURL
const StreamBaseURL = "https://api.alter.tv/media/live/";
const WebSocketURL = "https://api.alter.tv";

const Endpoint = {
  auth: {
    login: "login",
    register: "register",
    verifyOtp: "verify-otp",
    verifyOtpReset: "verify-otp-reset",
    sendOtp: "send-otp",
    resetPassword: "reset-password",
    socialLogin: "auth/social-login",
  },
  setting: {
    editProfile: "edit-profile",
    editAvatarPhoto: "edit-profile-photo",
    editCoverPhoto: "edit-cover-photo",
    changePassword: "change-password",
    getFollower: "get-followers",
    removeFollower: "remove-follower",
    getDonation: "get-donations",
    getUserPayments: "get-user-payments",
    savePaypal: "save-paypal-email",
    removePaypal: "remove-paypal-email",
    enableOrDisbleDontn: "enable-or-disable-donation",
    toggleNotification: "update-notification",
    getSubscription: "get-subscribers",
    addSubscription: "add-or-update-subscription-price",
    createStripeAccount: "create-stripe-user",
    checkStripeAccount: "check-stripe-account-connected",
    disconnectStripe: "disconnect-stripe-account",
    listSubscription: "list-paid-subscription",
  },
  user: {
    getProfile: "get-user-profile",
    getPublicProfile: "get-public-profile",
    follow: "follow",
    unFollow: "unfollow",
    getFollowing: "get-followings",
    profileShort: "get-user-shorts",
    deleteProfileShort: "delete-short",
  },
  short: {
    uploadShort: "add-short",
    updateShort: "update-short",
    shortDetail: "get-short-details",
    listShortComment: "get-short-comments",
    addShortComment: "add-short-comment",
    delShortComment: "delete-short-comment",
    updateShortComment: "update-short-comment",
    addShortReaction: "add-short-reaction",
    delShortReaction: "delete-short-reaction",
  },
  notification: {
    list: "notification",
    notificationCount: "get-notifications-counts",
  },
  feed: {
    feedShort: "shorts",
    recentStream: "get-recent-streams",
    getLiveStream: "get-live-streams",
    getUserLiveStream: "get-user-live-streams",
    topStreamers: "get-top-streamers",
    topFollowers: "get-user-followings",
  },
  package: {
    list: "get-user-packages",
    subscribePackage: "subscribe-package",
    cancelSubscription: "cancel-subscription",
  },
  search: {
    globalSearch: "global-search",
  },
  stream: {
    start: "start-stream",
    delStream: "delete-stream",
    updateStream: "update-stream",
    trendingStreamer: "trending-streamers",
    addStreamReaction: "add-stream-reaction",
    getStreamDetails: "get-stream-details",
    listStreamComment: "get-stream-comments",
    checkStreamingStatus: "check-to-go-live",
    delStreamComment: "delete-stream-comment",
    hasSubscribeStream: "has-subscribed-stream",
  },
  paymentORdonation: {
    addDonation: "paypal",
  },
  card: {
    addCard: "add-new-card",
    getAllCard: "get-all-card",
    removeCard: "remove-card",
    defaultCard: "default-card",
  },
  landing: {
    terms: "get-terms/0",
    privacy: "get-terms/1",
  },
};

export {
  BaseURL,
  GoogleAPI,
  FacebookAppId,
  Endpoint,
  PaypalClientId,
  PaypalSecret,
  StreamBaseURL,
  WebSocketURL,
  stripePublicKey,
  SocketURL,
};
