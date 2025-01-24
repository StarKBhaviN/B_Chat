import { View, Text } from "react-native";

import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import blurhash, { formatMessageTime, getRoomID } from "../utils/common";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Badge } from "react-native-elements";
import { ThemeContext } from "../context/ThemeContext";
import { useRouter } from "expo-router";

export default function ChatItem({ item, noBorder, currentUser }) {
  const router = useRouter();

  const { theme, colorScheme } = useContext(ThemeContext);
  const [lastMessage, setLastMessage] = useState(undefined);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let roomId = getRoomID(currentUser?.userId, item?.userId);
    const messagesRef = collection(doc(db, "rooms", roomId), "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

    const unsub = onSnapshot(q, (snapshot) => {
      if (!currentUser) return;
      if (!snapshot.empty) {
        const lastMsg = snapshot.docs[0].data();
        getUnreadMessage(roomId);
        setLastMessage(lastMsg);
      } else {
        setLastMessage(null);
      }
    });

    return () => unsub();
  }, []);

  const getUnreadMessage = async (roomId) => {
    if (!currentUser) return;
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");

    try {
      const unreadQuery = query(
        messagesRef,
        where("userId", "==", item?.userId),
        where("isReaded", "==", false)
      );

      const unreadSnapShot = await getDocs(unreadQuery);
      setUnreadCount(unreadSnapShot.size);
    } catch (error) {
      console.error(error);
    }
  };

  const openChatRoom = () => {
    router.push({ pathname: "/chatRoom", params: item });
  };

  const renderTime = () => {
    if (!currentUser) return;
    if (lastMessage) {
      return formatMessageTime(lastMessage?.createdAt);
    }
    return "";
  };

  const renderLastMessage = () => {
    if (!currentUser) return;
    if (typeof lastMessage == "undefined") {
      return "Loading...";
    } else if (lastMessage) {
      if (currentUser?.userId === lastMessage?.userId) {
        return "You : " + lastMessage?.text;
      } else {
        return lastMessage?.text;
      }
    } else {
      return "Say Hii👋";
    }
  };

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${
        noBorder ? "" : `border-b`
      }`}
      style={{
        borderBottomColor: colorScheme === "dark" ? "#3C3C3C" : "#423b3b",
      }}
    >
      <View style={{ alignItems: "flex-start" }}>
        <Badge
          status={
            item.status === "online"
              ? "success"
              : item.status === "disconnected"
              ? "error"
              : "warning"
          }
          containerStyle={{ position: "absolute", top: -2 }}
        />
        <Image
          source={item?.profileURL}
          style={{ height: hp(5.5), width: hp(5.5), borderRadius: 100 }}
          className="rounded-full"
          placeholder={blurhash}
          transition={500}
        />
      </View>

      {/* Name and Last Message */}
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{
              fontSize: hp(1.8),
              color: colorScheme === "dark" ? "#d4d4d6" : theme.text,
            }}
            className="font-semibold"
          >
            {item?.profileName}
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-medium text-neutral-500"
          >
            {renderTime()}
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.6), width: wp(70), maxHeight: hp(2.3) }}
            className="font-medium text-neutral-500"
          >
            {renderLastMessage()}
          </Text>
          {unreadCount > 0 && (
            <Badge
              value={<Text style={{ fontSize: 12 }}>{unreadCount}</Text>}
              status="success"
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
