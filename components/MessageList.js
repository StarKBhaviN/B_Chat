import { View, Text, ScrollView } from "react-native";
import React from "react";
import MessageItem from "./MessageItem";
import Typing from "./Typing";

export default function MessageList({
  messages,
  currentUser,
  scrollViewRef,
  isTyping,
}) {
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
          <MessageItem
            message={message}
            key={index}
            currentUser={currentUser}
          />
        );
      })}

      {isTyping && <Typing />}
    </ScrollView>
  );
}
