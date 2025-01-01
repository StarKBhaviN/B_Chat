import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StyleSheet } from "react-native";
import { useAuth } from "../../context/authContext";
import { router } from "expo-router";

export default function Profile() {
  const { user } = useAuth();
  return (
    <View className="flex-1">
      <View className="gap-3 px-4">
        <View className="items-center mt-5 ">
          <Image source={user?.profileURL} style={styles.profileImage} />
        </View>
        <View>
          <Text className="text-center" style={styles.text}>
            {user?.profileName}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-center" style={styles.text}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    height: hp(25),
    width: hp(25),
    borderRadius: 300,
  },
  text: {
    fontSize: 20,
  },
});
