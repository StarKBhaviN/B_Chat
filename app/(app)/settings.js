import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

export default function Settings() {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const Row = ({ children }) => <View style={styles.row}>{children}</View>;

  const Col = ({ numRows, children, style }) => (
    <TouchableOpacity
      style={[styles[`${numRows}col`], style]}
      className="flex items-center justify-center rounded-xl p-2 mx-1"
    >
      {children}
    </TouchableOpacity>
  );

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
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="grid-cols-4 py-2" style={styles.container}>
        {/* Row 1 */}
        <Row>
          <Col numRows={4} style={{ backgroundColor: "#2f3a4b" }}>
            <View className="flex flex-row">
              <MaterialCommunityIcons
                name="cookie-clock"
                size={24}
                color={"gray"}
                className="me-2"
              />
              <Text className="text-center text-lg text-white">
                10 mins Used Today
              </Text>
            </View>
          </Col>
        </Row>

        {/* Row 2 */}
        <Row>
          <Col numRows={2}>
            <Feather name="user" size={24} color={"black"} />
            <Text className="text-center">Edit Profile</Text>
          </Col>
          <Col numRows={2}>
            <MaterialIcons name="privacy-tip" size={24} color={"black"} />
            <Text className="text-center">Privacy</Text>
          </Col>
        </Row>

        {/* Row 3 */}
        <Row>
          <Col numRows={1}>
            <Feather name="mail" size={24} color={"black"} />
            <Text className="text-center">Verify Email</Text>
          </Col>
          <Col numRows={1}>
            <MaterialIcons
              name="connect-without-contact"
              size={24}
              color={"black"}
            />
            <Text className="text-center">Socials</Text>
          </Col>
          <Col numRows={1}>
            <MaterialCommunityIcons
              name="sleep-off"
              size={24}
              color={"black"}
            />
            <Text className="text-center">Sleep</Text>
          </Col>
          <Col numRows={1}>
            <Ionicons name="invert-mode" size={24} color={"black"} />
            <Text className="text-center">Theme</Text>
          </Col>
        </Row>

        {/* Row 4 */}
        <Row>
          <Col numRows={2} style={{ flex: 2 }}>
            <FontAwesome name="bell-o" size={24} color={"black"} />
            <Text className="text-center">Notifications</Text>
          </Col>
          <Col numRows={1}>
          <Ionicons name="help-circle-outline" size={24} color={"black"} />
            <Text className="text-center">Help</Text>
          </Col>
          <Col numRows={1}>
          <Ionicons name="help-circle-outline" size={24} color={"black"} />
            <Text className="text-center">Help</Text>
          </Col>
        </Row>
      </View>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: wp(90),
      marginHorizontal: "auto",
      backgroundColor: theme.background,
    },
    row: {
      flexDirection: "row",
      marginBottom: 12,
    },
    "1col": {
      backgroundColor: theme.tint,
      borderColor: "#fff",
      borderWidth: 1,
      flex: 1,
    },
    "2col": {
      backgroundColor: theme.tint,
      borderColor: "#fff",
      borderWidth: 1,
      flex: 2,
    },
    "3col": {
      backgroundColor: theme.tint,
      borderColor: "#fff",
      borderWidth: 1,
      flex: 3,
    },
    "4col": {
      backgroundColor: theme.tint,
      borderColor: "#fff",
      borderWidth: 1,
      flex: 4,
    },
  });
}
