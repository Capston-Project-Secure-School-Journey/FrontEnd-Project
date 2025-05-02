importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey:
    "BFCp89HL2ImufTPqMDbCbtcM6K2Rr1HxAC_ICYjq-S4_bscM7CRdvC6DIVSddyThWFHVuWzvXBLpDkeTKjCVZBg",
  authDomain: "capstonproject-769ed.firebaseapp.com",
  projectId: "capstonproject-769ed",
  messagingSenderId: "564080456486",
  appId: "1:564080456486:web:0bccbb2eb07dad6bac07e7",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/firebase-logo.png",
  });

  const channel = new BroadcastChannel("fcm_channel");
  channel.postMessage({ title, body });
});
