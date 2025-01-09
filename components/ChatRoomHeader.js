import { View, Text, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useState, useRef } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user?.userId) {
      const unsubscribe = onSnapshot(
        doc(db, "users", user.userId),
        (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setLastSeen(data.lastSeen);
            setStatus(data.status);
          }
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const renderTime = () => {
    if (lastSeen) {
      return formatMessageTime(lastSeen);
    }
    return "Active Now";
  };

  const expandedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, hp(26)],  // Adjust height as needed
  });

  return (
    <>
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

              <TouchableOpacity
                onPress={toggleExpand}
                activeOpacity={0.8}
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                {!isExpanded && (
                  <Image
                    source={user?.profileURL}
                    style={{
                      height: hp(4.5),
                      aspectRatio: 1,
                      borderRadius: 100,
                    }}
                  />
                )}
                <View>
                  <Text
                    style={{
                      fontSize: hp(2.5),
                      marginBottom: -1,
                    }}
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
              </TouchableOpacity>
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

      {/* Expanded View Section */}
      <Animated.View
        style={{
          height: expandedHeight,
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
          padding: isExpanded ? hp(1) : 0,
          alignItems: "center",
        }}
      >
        {isExpanded && (
          <View style={{ alignItems: "center",borderWidth : 1, width : wp(80), paddingHorizontal : 10 }}>
            <Image
              source={user?.profileURL}
              style={{
                height: hp(12),
                aspectRatio: 1,
                borderRadius: 100,
                marginBottom: hp(0),
              }}
            />
            <Text
              style={{
                fontSize: hp(3),
                fontWeight: "600",
              }}
            >
              {user?.profileName}
            </Text>
            <Text
              style={{
                fontSize: hp(2),
                color: "#737373",
                marginTop: hp(.5),
              }}
            >
              {user?.bio || "This user hasn't added a bio yet."}
            </Text>
            <Text style={{ fontSize: hp(1.8), marginTop: 10 }}>
              Joined: {user?.joinedDate || "N/A"}
            </Text>
          </View>
        )}
      </Animated.View>
    </>
  );
}
