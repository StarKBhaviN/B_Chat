import { View, Text } from "react-native";

import React, { useEffect, useState } from "react";
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
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ChatItem({ item, router, noBorder, currentUser }) {
  const [lastMessage, setLastMessage] = useState(undefined);

  useEffect(() => {
    // Fetches messages
    let roomId = getRoomID(currentUser?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data(0);
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });
    return unsub;
  }, []);

  // console.log(lastMessage)
  const openChatRoom = () => {
    router.push({ pathname: "/chatRoom", params: item });
  };

  const renderTime = () => {
    if (lastMessage) {
      return formatMessageTime(lastMessage?.createdAt);
    }
    return "";
};

  const renderLastMessage = () => {
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
        noBorder ? "" : "border-b b-neutral-600"
      }`}
    >
      <Image
        source={item?.profileURL}
        style={{ height: hp(5.5), width: hp(5.5), borderRadius: 100 }}
        className="rounded-full"
        placeholder={blurhash}
        transition={500}
      />

      {/* Name and Last Message */}
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-800"
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
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-medium text-neutral-500"
        >
          {renderLastMessage()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
