import { View } from "react-native";
import React, { useContext } from "react";
import LottieView from "lottie-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "../context/ThemeContext";

export default function Typing() {
  const {theme,colorScheme} = useContext(ThemeContext)
  return (
    <View style={{ width: wp(10) }} className="ml-3 mb-3">
      <View
        className="rounded-2xl px-7 border border-neutral-500"
        style={{
          backgroundColor: colorScheme === "dark" ? "#092635" : "#ebf4ff",
        }}
      >
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
