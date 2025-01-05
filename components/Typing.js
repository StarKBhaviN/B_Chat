import { View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Typing() {
  return (
    <View style={{ width: wp(10) }} className="ml-3 mb-3">
      <View className="rounded-2xl px-7 bg-indigo-100 border border-indigo-200">
        <LottieView
          style={{
            minWidth: hp(40),
            height: hp(5.3),
            alignSelf: "center",
            borderWidth: 3,
          }}
          source={require("../assets/images/typing.json")}
          autoPlay
          loop
        />
      </View>
    </View>
  );
}
