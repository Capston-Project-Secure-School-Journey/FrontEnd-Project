import { messaging } from "@/firebase/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { ref } from "vue";

const config = useRuntimeConfig();

export function useFirebaseMessaging() {
  const fcmToken = ref<string | null>(null);
  const notification = ref<Notification | null>(null);

  const requestPermission = async () => {
    try {
      const vapidKey = config.public.FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, { vapidKey });
      if (token) {
        fcmToken.value = token;
        console.log("FCM Token:", token);
      } else {
        console.warn("No token received. Permission may be denied.");
      }
    } catch (error) {
      console.error("Error getting FCM token", error);
    }
  };

  onMessage(messaging, (payload) => {
    console.log("📨 Foreground message:", payload);
    const { title = "", body = "" } = payload.notification || {};
    notification.value = { title, body };
  });

  return {
    fcmToken,
    notification,
    requestPermission,
  };
}

interface Notification {
  title: string;
  body: string;
}
