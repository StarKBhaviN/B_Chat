import { View, Text, TouchableWithoutFeedback, ScrollView } from "react-native";
import React, { useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BeeRequest from "../../components/BeeRequest";
import { ThemeContext } from "../../context/ThemeContext";

export default function beez() {
  const { theme } = useContext(ThemeContext);
  return (
    <View className="flex-1 px-4 py-2" style={{ backgroundColor: theme.appBg }}>
      <Text className="mb-1" style={{ color: theme.glow }}>
        New Beez
      </Text>
      {/* Friend requests */}
      <View
        className="border rounded-xl p-2 mb-4"
        style={{ maxHeight: hp(40), borderColor : theme.border }}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
        </ScrollView>
      </View>

      {/* Other notifications */}
      <Text className="mb-1" style={{ color: theme.glow }}>
        Bee's anouncements
      </Text>

      <View
        className="border rounded-xl p-2 mb-4"
        style={{ maxHeight: hp(40), borderColor : theme.border }}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
        </ScrollView>
      </View>
    </View>
  );
}
