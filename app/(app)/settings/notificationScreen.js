import { View, Text, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function notificationScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <View className="flex flex-column items-start">
        <Text style={styles.heading}>Notification you can receive</Text>
        <Text style={styles.heading}> - Chats, Announcements</Text>
      </View>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    heading: {
      fontSize: 16,
      color: theme.glow,
    },
  });
}
