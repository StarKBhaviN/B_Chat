import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useCallback, useContext, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";

export default function FriendItem({ item, removeAsFriend }) {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const { user } = useAuth();
  const { profileName, profileURL } = item;

  const openChatRoom = () => {
    router.push({ pathname: "/chatRoom", params: item });
  };

  const openProfile = (userId) => {
    router.push(`${userId}`);
  };

  const openBottomSheet = () => {
    console.log("Open bottom sheets");
  };
  return (
    <View
      className="flex items-start border mx-2 rounded-lg mb-6"
      style={{ borderColor: theme.border, width: wp(44) }}
    >
      <View style={{ width: "100%" }}>
        <Text className="text-center py-1" style={styles.profileName}>
          {profileName}
        </Text>
      </View>

      <View className="flex flex-row items-center justify-center px-4">
        <Image
          source={
            profileURL
              ? profileURL
              : "https://img.freepik.com/premium-photo/beautiful-european-girl-poses-outdoors_333900-28236.jpg?semt=ais_incoming"
          }
          style={{
            height: hp(8),
            width: hp(7),
            borderRadius: 14,
            marginTop: 4,
            marginHorizontal: 2,
          }}
          placeholder={"blurhash"}
          transition={500}
        />

        <View style={styles.iconContainer}>
          <View className="flex flex-row mb-2">
            <Pressable
              className="rounded-lg mx-1"
              style={styles.smallIcon}
              onPress={() => openProfile(item.userId)}
            >
              <FontAwesome5 name="forumbee" size={15} color={theme.icon} />
            </Pressable>

            <Pressable
              className="rounded-lg mx-1"
              style={styles.smallIcon}
              onPress={openChatRoom}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={15}
                color={theme.icon}
              />
            </Pressable>
          </View>

          <View className="flex-1 flex-row">
            <Pressable
              className="flex-1 flex-row items-center justify-center rounded-lg mx-1 border py-1"
              style={{ borderColor: theme.border }}
              onPress={openBottomSheet}
            >
              <Feather name="send" size={14} color={theme.icon} />
              <Text className="ms-2" style={{ color: theme.text }}>
                Share
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable
        style={[styles.longIcon, { width: "100%", marginTop: 8 }]}
        className="flex-row items-center justify-center"
        onPress={() => removeAsFriend(user.userId, item.userId)}
      >
        <MaterialIcons name="delete-outline" size={20} color={theme.icon} />
        <Text style={styles.removeText}>Unfriend</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    profileName: {
      color: theme.glow,
      backgroundColor: theme.tint,
      borderRadius: 6,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      marginBottom: 4,
    },
    iconContainer: {
      flexDirection: "column",
      marginTop: 4,
    },
    smallIcon: {
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    longIcon: {
      backgroundColor: theme.tint,
      paddingVertical: 4,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    removeText: {
      marginLeft: 4,
      color: theme.text,
    },
  });
}
