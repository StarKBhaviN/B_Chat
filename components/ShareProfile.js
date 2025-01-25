import { View, Text } from "react-native";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ShareProfile() {
  const { theme } = useContext(ThemeContext);
  return (
    <View>
      <Text className="text-center" style={{ color: theme.glow }}>Profile Sharing Coming Soon. 😊</Text>
    </View>
  );
}
