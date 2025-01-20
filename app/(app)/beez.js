import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BeeRequest from "../../components/BeeRequest";
import { ThemeContext } from "../../context/ThemeContext";
import { SequencedTransition } from "react-native-reanimated";
import { useAuth } from "../../context/authContext";
import { useFriendContext } from "../../context/friendContext";

export default function beez() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const { friendRequests, fetchFriendRequests, acceptRequest, delRequest } =
    useFriendContext();

  // Fetch friend requests on component mount
  useEffect(() => {
    if (user?.userId) {
      fetchFriendRequests(user.userId);
    }
  }, [user, friendRequests.length]);

  // Accept friend request handler
  const handleAcceptRequest = async (friendId) => {
    const result = await acceptRequest(user.userId, friendId);
    alert(result);
  };

  const handleDelReq = async (incomingId) => {
    console.log(user.userId, incomingId);
    const res = await delRequest(user.userId, incomingId);
    alert(res);
  };

  return (
    <View className="flex-1 px-4 py-2" style={{ backgroundColor: theme.appBg }}>
      <Text className="mb-1" style={{ color: theme.glow }}>
        New Beez
      </Text>
      {/* Friend requests */}
      <View
        className="border rounded-xl p-2 mb-4"
        style={{ maxHeight: hp(40), borderColor: theme.border }}
      >
        {friendRequests.length > 0 ? (
          <Animated.FlatList
            itemLayoutAnimation={SequencedTransition}
            data={friendRequests}
            // contentContainerStyle={{ paddingVertical: 8 }}
            keyExtractor={(item) => item.senderId}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <BeeRequest
                  data={item}
                  onAccept={() => handleAcceptRequest(item.senderId)}
                  onReject={() => handleDelReq(item.senderId)}
                />
              );
            }}
          />
        ) : (
          <View className="p-2">
            <Text style={{ color: theme.text }}>No pending Requests</Text>
          </View>
        )}
      </View>

      {/* Other notifications */}
      <Text className="mb-1" style={{ color: theme.glow }}>
        Bee's anouncements
      </Text>

      <View
        className="border rounded-xl p-2 mb-4 flex-1 flex-grow"
        style={{ borderColor: theme.border }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={{ paddingBottom: hp(3) }}
        >
          {/* Ahiya j flatList aavse ema announcement data moklvana */}
          <BeeRequest />
          <Text>This feature is coming soon. Stay Tuned😊</Text>
        </ScrollView>
      </View>
    </View>
  );
}
