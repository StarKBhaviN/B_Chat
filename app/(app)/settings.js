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
//     - How much B_Chat used today (Nothing)
//     - Profile edits : Name, Profile pic (Modal)
//     - Privacy : Who can see your active status, Last online, About (Pop up)
//     - Email change and verification (Modal)
//     - Manage Friends (Page)
//     - Make me offline/sleep (Button)
//     - Theme : Dark, Light, System Default (Switch)
//     - Font Size progress bar
//     - Notification settings : Coming soon status (Modal)
//     - Help section (Page)