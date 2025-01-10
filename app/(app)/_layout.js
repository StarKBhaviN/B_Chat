import { View, Text } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import HomeHeader from "../../components/HomeHeader";

export default function _layout() {
  // const [currentPage, setCurrentPage] = useState("home")
  
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            header: () => <HomeHeader title="Chats" showProfile={true} showBack={false}/>,
          }}
          
        ></Stack.Screen>
        <Stack.Screen
          name="profile"
          options={{
            header: () => <HomeHeader title="Profile" showProfile={false} showBack={true}/>,
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="settings"
          options={{
            header: () => <HomeHeader title="Settings" showProfile={false} showBack={true}/>,
          }}
        ></Stack.Screen>
      </Stack>
    </View>
  );
}
