import { View, Text } from "react-native";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";
import { ThemeContext } from "../context/ThemeContext";

export default function BeeRequest() {
  const { theme,colorScheme } = useContext(ThemeContext);
  return (
    <View className="flex flex-row items-center border rounded-lg p-1 py-2 mb-2" style={{borderColor : colorScheme==="dark" ? "#37373d": "#484848"}}>
      <View className="me-2">
        <Image
          style={{
            height: hp(5),
            aspectRatio: 1,
            borderRadius: 100,
          }}
          source={
            "https://media.istockphoto.com/id/938709362/photo/portrait-of-a-girl.jpg?s=612x612&w=0&k=20&c=UQGXpeiLrI78nO1B9peUn0D0fCSRrm-J8xohMWG2Lms="
          }
          placeholder={blurhash}
          transition={500}
        />
      </View>

      <View className="flex-1 flex-row items-center justify-between">
        <View style={{ maxWidth: wp(54) }}>
          <Text style={{ color: theme.glow, fontSize: 16 }}>Bhavin Talia</Text>
          <View style={{ maxHeight: hp(4.5) }}>
            <Text style={{ color: theme.text }}>
              Hello, I am Bhavin i a huge friend of you can you pleej add me as
              your friend?
            </Text>
          </View>
        </View>

        <View className="me-1 flex-1 flex-col items-end">
          <TouchableOpacity>
            <Entypo
              name="cross"
              size={18}
              color={theme.icon}
              className="mb-1"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2 rounded-lg"
            style={{ backgroundColor: theme.tint }}
          >
            <Text style={{ color: theme.glow }}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
