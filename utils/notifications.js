import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
  // Check if permission has been granted
  const { status } = await Notifications.getPermissionsAsync();

  // Request permissions if not already granted
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      alert("Failed to get push token for notifications!");
      return null;
    }
  }

  // Get the Expo Push Token
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);
  return token;
}
