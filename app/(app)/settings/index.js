import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { settingsConfig } from "../../../utils/settingConfigs";
import { ThemeContext } from "../../../context/ThemeContext";

export default function settingsScreen({ navigation }) {
  const { theme, toggleThemeMode, colorScheme } = useContext(ThemeContext);

  const IconMap = {
    "cookie-clock": MaterialCommunityIcons,
    user: Feather,
    "privacy-tip": MaterialIcons,
    mail: Feather,
    "connect-without-contact": MaterialIcons,
    "sleep-off": MaterialCommunityIcons,
    "invert-mode": Ionicons,
    "bell-o": FontAwesome,
    "help-circle-outline": Ionicons,
  };

  const renderCol = (col) => {
    const Icon = IconMap[col.icon];
    return (
      <TouchableOpacity
        key={col.id}
        style={[
          styles.col,
          {
            flex: col.flex,
            backgroundColor: col.backgroundColor || theme.tint,
            flexDirection: col.flexDirection || "column",
          },
        ]}
        onPress={() => {
          if (col.route) navigation.navigate(col.route);
          if (col.action) col.action();
          if (col.id === "theme") {
            toggleThemeMode();
          }
        }}
      >
        {Icon && <Icon name={col.icon} size={24} color={theme.icon} />}
        <Text
          style={{
            textAlign: "center",
            color: col.textColor || theme.text,
            marginTop: col.marginTop || 3,
          }}
        >
          {col.id !== "theme" ? col.title : colorScheme==="light" ? "Dark" : "Light"}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRow = (row) => (
    <View key={row.id} style={styles.row}>
      {row.cols.map(renderCol)}
    </View>
  );
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {settingsConfig.map(renderRow)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  col: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});
