import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react"; // Removed ReactNode import as it's TypeScript-specific.
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../utils/notifications"; // `Subscription` import removed as TypeScript types are not needed.
import { useNavigation } from "@react-navigation/native";
import { getRoomID } from "../utils/common";

const NotificationContext = createContext(undefined); // Removed TypeScript type annotation.

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null); // Removed `string | null` type annotation.
  const [notification, setNotification] = useState(null); // Removed `Notifications.Notification | null` type annotation.
  const [error, setError] = useState(null); // Removed `Error | null` type annotation.

  const notificationListener = useRef(); // Removed type annotation `Subscription`.
  const responseListener = useRef(); // Removed type annotation `Subscription`.

  const navigation = useNavigation();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response: user interacts with a notification",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );

        // Check if the notification is related to a friend request
        const { type, senderId, message } =
          response.notification.request.content.data;

        // Navigate to the Beez page when it's a friend request
        if (type === "Friend_Request") {
          navigation.navigate("beez", { senderId, message });
        }

        // const roomId = getRoomID(userId, senderId);
        // if (type === "Message") {
        //   navigation.navigate(`chatRoom/${roomId}`);
        // }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [navigation]); // Made a huge change here remove if error or disturbance occurs

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }} // Removed explicit type definitions.
    >
      {children}
    </NotificationContext.Provider>
  );
};
