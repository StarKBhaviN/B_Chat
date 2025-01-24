import { View, Text, FlatList } from "react-native";
import React from "react";
import ChatItem from "./ChatItem";
import Animated, { LinearTransition, SequencedTransition } from "react-native-reanimated";

export default function ChatList({ users, currentUser }) {
  return (
    <View className="flex-1">
      <Animated.FlatList
        itemLayoutAnimation={SequencedTransition}
        data={users}
        contentContainerStyle={{ paddingVertical: 16 }}
        keyExtractor={(item) => item.userId}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatItem
            currentUser={currentUser}
            noBorder={index + 1 === users.length}
            item={item}
            index={index}
          />
        )}
      />
    </View>
  );
}
