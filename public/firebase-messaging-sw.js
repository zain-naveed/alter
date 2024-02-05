importScripts(
  "https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js"
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      firebase.messaging().useServiceWorker(registration);
    })
    .catch(function (err) {});
}

firebase.initializeApp({
  apiKey: "AIzaSyBXhFlZ1fvUO4JGSQQ0yfSkgDJ6U081k0k",
  authDomain: "alter-39724.firebaseapp.com",
  projectId: "alter-39724",
  storageBucket: "alter-39724.appspot.com",
  messagingSenderId: "397153300449",
  appId: "1:397153300449:web:378d5897e138df0f60eca0",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
