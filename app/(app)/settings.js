import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function settings() {
  return (
    <View style={styles.container}>
      <Text>settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

// Settings
//     - How much B_Chat used today
//     - Profile edits : Name, Profile pic
//     - Privacy : Who can see your active status, Online, About
//     - Email change and verification
//     - Manage Friends
//     - Make me offline/sleep
//     - Theme : Dark, Light, System Default
//     - Font Size progress bar
//     - Notification settings : Coming soon status
//     - Help section