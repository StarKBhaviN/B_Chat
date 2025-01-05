import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { formatMessageTime } from "../utils/common";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ChatRoomHeader({ user, router }) {
  const [lastSeen, setLastSeen] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (user?.userId) {
      const unsubscribe = onSnapshot(
        doc(db, "users", user.userId),
        (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setLastSeen(data.lastSeen); // Update lastSeen whenever Firestore updates
            setStatus(data.status);
          }
        }
      );

      return () => unsubscribe(); // Clean up the listener when the component unmounts
    }
  }, [user]);

  const renderTime = () => {
    if (lastSeen) {
      return formatMessageTime(lastSeen); // Format the lastSeen timestamp
    }
    return "Active Now"; // Default message when lastSeen is not available
  };

  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 1 }}
            >
              <Entypo name="chevron-left" size={hp(3.3)} color="#737373" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <Image
                source={user?.profileURL}
                style={{ height: hp(4.5), aspectRatio: 1, borderRadius: 100 }}
              />
              <View>
                <Text
                  style={{ fontSize: hp(2.5), marginBottom: -1 }}
                  className="text-neutral-700 font-medium"
                >
                  {user?.profileName}
                </Text>
                <Text style={{ fontSize: hp(1.6) }}>
                  {status === "online"
                    ? "Active Now"
                    : status === "offline"
                    ? "Just Now"
                    : `Active ${renderTime()}`}
                </Text>
              </View>
            </View>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-8">
            <Ionicons name="call" size={hp(2.8)} color={"#737373"} />
            <Ionicons name="videocam" size={hp(2.8)} color={"#737373"} />
          </View>
        ),
      }}
    />
  );
}
