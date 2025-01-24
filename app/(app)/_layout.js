import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { Stack } from "expo-router";
import HomeHeader from "../../components/HomeHeader";
import * as Notifications from "expo-notifications";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function _layout() {
  // const [currentPage, setCurrentPage] = useState("home")
  useEffect(() => {
    const subscription = Notifications.addPushTokenListener(async (token) => {
      if (auth.currentUser?.uid) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { pushToken: token });
      }
    });

    return () => subscription.remove();
  }, []);
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          header: () => (
            <HomeHeader title="Chats" showProfile={true} showBack={false} />
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="[userId]"
        options={{
          header: () => (
            <HomeHeader title="Profile" showProfile={false} showBack={true} />
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="profile"
        options={{
          header: () => (
            <HomeHeader title="Profile" showProfile={false} showBack={true} />
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="beez"
        options={{
          header: () => (
            <HomeHeader title="Beez" showProfile={false} showBack={true} />
          ),
        }}
      ></Stack.Screen>
    </Stack>
  );
}
