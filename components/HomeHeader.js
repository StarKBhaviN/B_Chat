import { View, Text, Platform, StyleSheet } from "react-native";
import React from "react";
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
import { AntDesign, Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const ios = Platform.OS == "ios";

export default function HomeHeader({ title = "Chats", showProfile = true }) {
  const { user, logout } = useAuth();
  const { top } = useSafeAreaInsets();

  const handleProfile = () => {
    router.push("profile")
  };
  const handleLogout = async () => {
    await logout();
  };
  return (
    <View style={[styles.header, { paddingTop: ios ? top : top + 10 }]}>
      <View>
        <Text style={[styles.text, { fontSize: hp(3) }]}>{title}</Text>
      </View>

      {showProfile && (
        <View>
          <Menu>
            <MenuTrigger>
              <Image
                style={{
                  height: hp(4.5),
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
                  backgroundColor: "white",
                  width: 160,
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 0 },
                },
              }}
            >
              <MenuItems
                text="Profile"
                action={handleProfile}
                icon={<Feather name="user" size={hp(2.5)} />}
              />
              <Divider />
              <MenuItems
                text="Sign Out"
                action={handleLogout}
                icon={<AntDesign name="logout" size={hp(2.5)} />}
              />
            </MenuOptions>
          </Menu>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#6366f1", // indigo-400
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});

const Divider = () => {
  return <View className="p-[1px] w-full bg-neutral-200" />;
};
