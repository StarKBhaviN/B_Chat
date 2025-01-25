import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";
import { useAuth } from "../context/authContext";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { MenuItems } from "./CustomMenuItems";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemeContext } from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Badge } from "react-native-elements";
import { useFriendContext } from "../context/friendContext";

const ios = Platform.OS == "ios";

export default function HomeHeader({
  title = "Chats",
  showProfile = true,
  showBack = false,
}) {
  const { colorScheme, theme } = useContext(ThemeContext);
  const { friendRequests } = useFriendContext();
  const styles = createStyles(theme, colorScheme);

  const { user, logout } = useAuth();
  const { top } = useSafeAreaInsets();

  const handleProfile = () => {
    router.push("profile");
  };

  const handleSettings = () => {
    router.push("settings");
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={[styles.headerLayout, { paddingTop: ios ? top : top }]}>
      <View style={[styles.header]}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <View>
          <Text style={[styles.text, { fontSize: hp(3) }]}>{title}</Text>
        </View>

        {showProfile && (
          <View className="flex flex-row items-center" style={{ padding: 0 }}>
            <TouchableOpacity
              className="me-3"
              onPress={() => router.push("beez")}
            >
              <View className="px-2">
                {friendRequests.length > 0 && (
                  <Badge
                    status="primary"
                    containerStyle={{ position: "absolute", top: 4, right: 0 }}
                  />
                )}
                <Text style={{ fontSize: 30, color: "#b8b8bc" }}>ദ</Text>
              </View>
            </TouchableOpacity>
            <Menu>
              <MenuTrigger>
                <Image
                  style={{
                    height: hp(5),
                    aspectRatio: 1,
                    borderRadius: 100,
                  }}
                  source={user?.profileURL}
                  placeholder={blurhash}
                  transition={500}
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    borderRadius: 10,
                    marginTop: 38,
                    marginLeft: -30,
                    backgroundColor:
                      colorScheme === "dark" ? "#222831" : "white",
                    width: 160,
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 0 },
                  },
                }}
              >
                <MenuItems
                  text="Profile"
                  action={handleProfile}
                  icon={
                    <Feather name="user" size={hp(2.5)} color={theme.icon} />
                  }
                />
                <Divider />
                <MenuItems
                  text="Settings"
                  action={handleSettings}
                  icon={
                    <Feather
                      name="settings"
                      size={hp(2.5)}
                      color={theme.icon}
                    />
                  }
                />
                <Divider />
                <MenuItems
                  text="Sign Out"
                  action={handleLogout}
                  icon={
                    <AntDesign
                      name="logout"
                      size={hp(2.5)}
                      color={theme.icon}
                    />
                  }
                />
              </MenuOptions>
            </Menu>
          </View>
        )}

        {showBack && (
          <Ionicons
            name="arrow-back"
            size={24}
            style={{ padding: 4 }}
            color={"white"}
            onPress={() => router.back()}
          />
        )}
      </View>
    </View>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    headerLayout: {
      backgroundColor: theme.appBg, 
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: "#2f3a4b", 
      paddingBottom: 4,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      minHeight: 55,
    },
    text: {
      color: "white",
      fontSize: 20,
    },
  });
}

const Divider = () => {
  const { colorScheme } = useContext(ThemeContext);
  return (
    <View
      className="p-[.5px] w-full"
      style={{
        backgroundColor: colorScheme === "dark" ? "#3C3C3C" : "#423b3b",
      }}
    />
  );
};
