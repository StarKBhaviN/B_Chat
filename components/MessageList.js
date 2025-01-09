import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import Typing from "./Typing";

export default function MessageList({
  messages,
  currentUser,
  scrollViewRef,
  isTyping,
}) {
  const [unreadIndex, setUnreadIndex] = useState(null);

  useEffect(() => {
    const firstUnreadIndex = messages.findIndex(
      (message) => !message.isReaded && message.userId !== currentUser.userId
    );
    setUnreadIndex(firstUnreadIndex);
  }, []); // Removed messages from here so unread wont work

  // useEffect(() => {
  //   if (unreadIndex !== null && unreadIndex !== -1) {
  //     setTimeout(() => {
  //       scrollViewRef?.current?.scrollTo({
  //         y: 10, // Adjust based on message height
  //         animated: true,
  //       });
  //     }, 30000);
  //   }
  // }, [unreadIndex]);
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingTop: 10 }}
      onContentSizeChange={() =>
        scrollViewRef?.current?.scrollToEnd({ animated: true })
      }
    >
      {messages.map((message, index) => {
        return (
          <View key={index}>
            {index === unreadIndex && unreadIndex !== -1 && (
              <View style={styles.unreadDivider}>
                <Text style={styles.unreadText}>
                  {messages.length - unreadIndex} unread messages
                </Text>
              </View>
            )}
            <MessageItem message={message} currentUser={currentUser} />
          </View>
        );
      })}

      {isTyping && <Typing />}
    </ScrollView>
  );
}

const styles = {
  unreadDivider: {
    paddingVertical: 8,
    backgroundColor: "#FFD700",
    alignItems: "center",
    marginVertical: 8,
    borderRadius: 5,
  },
  unreadText: {
    color: "#333",
    fontWeight: "bold",
  },
};
