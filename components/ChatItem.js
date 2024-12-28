import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ChatItem({ item, router, noBorder }) {
  return (
    <TouchableOpacity
      className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${
        noBorder ? "" : "border-b b-neutral-600"
      }`}
    >
      <Image
        source={require("../assets/images/favicon.png")}
        style={{ height: hp(5.5), width: hp(5.5) }}
        className="rounded-full"
      />

      {/* Name and Last Message */}
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-800"
          >
            Bhavin
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-medium text-neutral-500"
          >
            Time
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-medium text-neutral-500"
        >
          Last Message
        </Text>
      </View>
    </TouchableOpacity>
  );
}
