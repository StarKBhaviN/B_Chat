import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
// import * as Notifications from "expo-notifications";
// import { registerForPushNotificationsAsync } from "../utils/notifications";
import registerNNPushToken from "native-notify";

// Here push token for notification
export default function StartPage() {
  // use registerNNPushToken()
  registerNNPushToken(26141, "xofubqXXZgguvu0HbXHbuX");
  
  // useEffect(() => {
  //   // Call the function to register for notifications
  //   registerForPushNotificationsAsync();
  // }, []);


  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="gray" />
    </View>
  );
}
