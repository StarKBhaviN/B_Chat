import React from "react";
import { Stack } from "expo-router";
import HomeHeader from "../../../components/HomeHeader";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" // Corresponds to settings/index.js
        options={{
          header: () => (
            <HomeHeader title="Settings" showProfile={false} showBack={true} />
          ),
        }}
      />
      <Stack.Screen
        name="notificationScreen" // Corresponds to settings/notifications.js
        options={{
          header: () => (
            <HomeHeader
              title="Notifications"
              showProfile={false}
              showBack={true}
            />
          ),
        }}
      />
    </Stack>
  );
}
