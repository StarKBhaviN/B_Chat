import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import Typing from "./Typing";
import { ThemeContext } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { formatMessageTime } from "../utils/common";

export default function MessageList({
  messages,
  currentUser,
  scrollViewRef,
  isTyping,
  roomId,
}) {
  const { theme } = useContext(ThemeContext);
  const [unreadIndex, setUnreadIndex] = useState(null);
  const [lastSeenIndex, setLastSeenIndex] = useState(null);

  // Calculate unread index
  useEffect(() => {
    const firstUnreadIndex = messages.findIndex(
      (message) => !message.isReaded && message.userId !== currentUser.userId
    );
    setUnreadIndex(firstUnreadIndex);
  }, [messages, currentUser]);

  // Calculate last seen index
  useEffect(() => {
    const lastSeenIndex = messages.reduceRight(
      (lastIndex, message, index) =>
        lastIndex === -1 &&
        message.isReaded &&
        message.userId === currentUser.userId
          ? index
          : lastIndex,
      -1
    );
    setLastSeenIndex(lastSeenIndex);
  }, [messages, currentUser]);

  // Determine if the last message is sent by the user
  const isLastMessageByUser =
    messages.length > 0 &&
    messages[messages.length - 1].userId === currentUser.userId;

  // Get the readTime of the last seen message
  const lastSeenReadTime =
    lastSeenIndex !== -1 ? messages[lastSeenIndex]?.readTime : null;

    // console.log("Last seen message : ",messages[lastSeenIndex])
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingTop: 10 }}
      onContentSizeChange={() =>
        scrollViewRef?.current?.scrollToEnd({ animated: false })
      }
    >
      {messages.map((message, index) => {
        return (
          <View key={index}>
            <MessageItem
              message={message}
              currentUser={currentUser}
              roomId={roomId}
            />
            {/* Show last seen marker only below the last seen message */}
            {index === lastSeenIndex &&
              lastSeenIndex !== -1 &&
              isLastMessageByUser && (
                <View
                  className="flex flex-row items-center justify-end me-4"
                  style={{ marginTop: -4,marginBottom : 5 }}
                >
                  <Ionicons
                    name="eye"
                    size={10}
                    color={theme.icon}
                    className="me-1"
                  />
                  <Text style={{ color: theme.text, fontSize: 10 }}>
                    {lastSeenReadTime
                      ? formatMessageTime(lastSeenReadTime)
                      : "..."}
                  </Text>
                </View>
              )}
          </View>
        );
      })}

      {isTyping && <Typing />}
    </ScrollView>
  );
}

// {
//               // If last message is of mine and not seen then show this
//               lastSeenIndex && (
// <View className="flex flex-row items-center justify-end mt-2 me-2">
//   <Ionicons
//     name="eye"
//     size={10}
//     color={theme.icon}
//     className="me-1"
//   />
//   <Text style={{ color: theme.text, fontSize: 10 }}>
//     5m ago
//   </Text>
// </View>
//               )
//             }
