import { View, Text, FlatList } from "react-native";
import React, { useCallback, useState } from "react";
import ChatItem from "./ChatItem";
import Animated, {
  LinearTransition,
  SequencedTransition,
} from "react-native-reanimated";
import { RefreshControl } from "react-native";

export default function ChatList({ users, currentUser }) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  
  return (
    <View className="flex-1">
      <Animated.FlatList
        itemLayoutAnimation={SequencedTransition}
        data={users}
        contentContainerStyle={{ paddingVertical: 16 }}
        keyExtractor={(item) => item.userId}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
