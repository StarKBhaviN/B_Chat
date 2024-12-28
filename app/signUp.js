import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { useAuth } from "../context/authContext";

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passRef = useRef();
  const profileURLRef = useRef();
  const userNameRef = useRef();

  const handleRegister = async () => {
    if (!emailRef.current || !passRef.current || !userNameRef.current || !profileURLRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields!!");
      return;
    }
    setLoading(true);

    let resp = await register(
      emailRef.current,
      passRef.current,
      userNameRef.current,
      profileURLRef.current,
    );
    setLoading(false);

    if (!resp.success) {
      Alert.alert("Sign Up", resp.msg);
    }
  };
  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View
        style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}
        className="flex-1 gap-12"
      >
        <View className="items-center">
          <Image
            style={{ height: hp(25) }}
            source={require("../assets/images/Auth/SignIn_bg.jpg")}
          />
        </View>

        <View className="gap-10">
          <Text
            style={{ fontSize: hp(4) }}
            className="font-bol tracking-wider text-center text-neutral-800"
          >
            Sign Up
          </Text>

          {/* Inputs */}
          <View className="gap-4">
            <View className="gap-3">
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 bg-neutral-100 items-center rounded-2xl p-2 bg-gray-400"
              >
                <Octicons name="people" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={(value) => (userNameRef.current = value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Name"
                  placeholderTextColor={"gray"}
                />
              </View>
            </View>

            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 bg-neutral-100 items-center rounded-2xl p-2 bg-gray-400"
            >
              <Octicons name="mail" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Email Address"
                placeholderTextColor={"gray"}
              />
            </View>

            <View className="gap-3">
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 bg-neutral-100 items-center rounded-2xl p-2 bg-gray-400"
              >
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={(value) => (passRef.current = value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Password"
                  secureTextEntry
                  placeholderTextColor={"gray"}
                />
              </View>
            </View>
            <View className="gap-3">
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 bg-neutral-100 items-center rounded-2xl p-2 bg-gray-400"
              >
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={(value) => (profileURLRef.current = value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Profile URL"
                  placeholderTextColor={"gray"}
                />
              </View>
            </View>

            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(7)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleRegister}
                  style={{ height: hp(6) }}
                  className="mt-2 mb-2 bg-indigo-500 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2.7) }}
                    className="text-white font-bold tracking-wider"
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* SignUp Text */}

            <View className="flex-row justify-center">
              <Text
                style={{ fontSize: hp(1.8) }}
                className="font-semibold text-neutral-500"
              >
                Already Have an Account?{" "}
              </Text>
              <Pressable onPress={() => router.push("signIn")}>
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-semibold text-indigo-600"
                >
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
