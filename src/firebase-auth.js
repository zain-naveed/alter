import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBXhFlZ1fvUO4JGSQQ0yfSkgDJ6U081k0k",
  authDomain: "alter-39724.firebaseapp.com",
  projectId: "alter-39724",
  storageBucket: "alter-39724.appspot.com",
  messagingSenderId: "397153300449",
  appId: "1:397153300449:web:378d5897e138df0f60eca0",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging();

const requestForToken = async () => {
  try {
    return getToken(messaging, {
      vapidKey:
        "BOpLncXg1k5r8uhSHkWud4_sAQT0ll1gmWr8ymkWVgaGuoM0bL5Mzlss-NOr0ZJFO22mtvimV7eBj9UoZict5iA",
    });
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

const onMessageListener = async (callback) => {
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
      callback(payload);
    });
  });
};

export { firebaseApp, onMessageListener, requestForToken };
