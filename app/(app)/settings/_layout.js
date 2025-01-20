import React from "react";
import { Stack } from "expo-router";
import HomeHeader from "../../../components/HomeHeader";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <HomeHeader title="Settings" showProfile={false} showBack={true} />
          ),
        }}
      />
      <Stack.Screen
        name="notificationScreen"
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
      <Stack.Screen
        name="privacy"
        options={{
          header: () => (
            <HomeHeader title="Privacy" showProfile={false} showBack={true} />
          ),
        }}
      />
      <Stack.Screen
        name="emailVerification"
        options={{
          header: () => (
            <HomeHeader
              title="Verify Email"
              showProfile={false}
              showBack={true}
            />
          ),
        }}
      />
      <Stack.Screen
        name="helpScreen"
        options={{
          header: () => (
            <HomeHeader title="Help" showProfile={false} showBack={true} />
          ),
        }}
      />
      <Stack.Screen
        name="socialScreen"
        options={{
          header: () => (
            <HomeHeader title="Socials" showProfile={false} showBack={true} />
          ),
        }}
      />
    </Stack>
  );
}
