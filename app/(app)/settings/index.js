import React, { useContext, useState } from "react";
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
import ModalTimeUsed from "../../../components/ModalTimeUsed";

export default function settingsScreen({ navigation }) {
  const { theme, toggleThemeMode, colorScheme } = useContext(ThemeContext);

  const [isSleepActive, setIsSleepActive] = useState(null);
  const [showUseageModal, setShowUsageModal] = useState(false);
  const handleSleepToggle = () => {
    setIsSleepActive((prevState) => !prevState);
  };

  console.log(showUseageModal)
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
    const isSleepButton = col.id === "sleep";

    return (
      <TouchableOpacity
        key={col.id}
        style={[
          styles.col,
          {
            flex: col.flex,
            backgroundColor: isSleepButton
              ? isSleepActive
                ? theme.tint
                : "#2f3a4b"
              : col.backgroundColor || theme.tint,
            flexDirection: col.flexDirection || "column",
          },
        ]}
        onPress={() => {
          if (col.id === "usedToday") {
            console.log("Opening modal")
            setShowUsageModal(true)
          }
          if (col.action) col.action();
          if (col.id === "theme") {
            toggleThemeMode();
          }
          if (isSleepButton) {
            handleSleepToggle();
          }
        }}
      >
        {Icon && <Icon name={col.icon} size={24} color={theme.icon} />}
        <Text
          style={{
            textAlign: "center",
            color: isSleepButton
              ? isSleepActive
                ? theme.text
                : "#c8c8c8"
              : col.textColor || theme.text,
            marginTop: col.marginTop || 3,
          }}
        >
          {isSleepButton
            ? isSleepActive
              ? "Sleep"
              : "Wake"
            : col.id !== "theme"
            ? col.title
            : colorScheme === "light"
            ? "Dark"
            : "Light"}
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
      <Text className="text-center mb-2" style={{ color: theme.text }}>
        All the settings are under development. Stay Tuned 😊
      </Text>
      {settingsConfig.map(renderRow)}

      <ModalTimeUsed setModalVisible={setShowUsageModal} modalVisible={showUseageModal} />
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
