import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlayfairDisplay_500Medium } from "@expo-google-fonts/dev";
import { useFonts } from "expo-font";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const emailRef = useRef();
  const passRef = useRef();

  const [fontLoaded] = useFonts({
    PlayfairDisplay_500Medium,
  });
  if (!fontLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  const handleLogin = async () => {
    if (!emailRef.current || !passRef.current) {
      Alert.alert("Sign In", "Please fill all the fields!!");
      return;
    }

    setLoading(true);

    const resp = await login(emailRef.current, passRef.current);
    setLoading(false);

    if (!resp.success) {
      Alert.alert("Sign In", resp.msg);
    }
  };

  // const handleGoogleSignIn = async() => {
  //   try {
  //     const res = await signInWithGoogle()
  //     console.log("User Signed In With Google : ",res.user?.uid)
  //   } catch (error) {
  //     console.error("User Sign-In Failed : ",res.msg, error)
  //   }
  // }
  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <View
        style={{ paddingHorizontal: wp(6) }}
        className="flex-1 gap-6 bg-neutral-100"
      >
        <View className="items-center">
          <Image
            style={{ height: hp(30) }}
            source={require("../assets/images/Auth/SignIn_bg.jpg")}
          />
        </View>

        <View className="gap-4">
          <Text
            style={[styles.myFont, { fontSize: hp(4) }]}
            className="font-bol tracking-wider text-center text-neutral-800"
          >
            Sign In
          </Text>

          {/* Inputs */}
          <View className="gap-3">
            <View
              style={{ height: hp(7) }}
              className="flex-row px-4 gap-3 bg-neutral-200 items-center rounded-2xl"
            >
              <Octicons
                name="mail"
                size={hp(2.7)}
                color="gray"
                style={{ width: wp(6.6), textAlign: "center" }}
              />
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
                className="flex-row px-4 gap-3 bg-neutral-200 items-center rounded-2xl"
              >
                <Octicons
                  name="lock"
                  size={hp(2.7)}
                  color="gray"
                  style={{ width: wp(6.6), textAlign: "center" }}
                />
                <TextInput
                  onChangeText={(value) => (passRef.current = value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Password"
                  secureTextEntry
                  placeholderTextColor={"gray"}
                />
              </View>
              <Text
                style={{ fontSize: hp(1.8) }}
                className="font-semibold text-right text-neutral-600"
              >
                Forgot Password?
              </Text>
            </View>

            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(7)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleLogin}
                  style={{ height: hp(6) }}
                  className="bg-indigo-600 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2.7) }}
                    className="text-white font-bold tracking-wider"
                  >
                    Sign In
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
                Don't Have an Account?{" "}
              </Text>
              <Pressable onPress={() => router.push("signUp")}>
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-semibold text-indigo-600"
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>

            <View className="flex-column items-center">
              <Text
                style={{ fontSize: hp(1.8) }}
                className="mb-2 font-semibold text-ingigo-700"
              >
                OR{" "}
              </Text>
              <Pressable
                className="p-4 rounded-2xl px-6 flex-row items-center"
                style={styles.googleButton}
                onPress={() => Alert.alert("SignIn","Coming Soon!!!")}
              >
                <AntDesign name="google" size={22} color={"orange"} />
                <Text
                  style={{ fontSize: hp(1.7) }}
                  className="font-semibold text-indigo-600 mx-2"
                >
                  Sign-In with Google
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  myFont: {
    fontFamily: "PlayfairDisplay_500Medium",
  },
  googleButton: {
    // height : hp(4),
    backgroundColor: "white",
    boxShadow : "1px 1px 4px black"
  },
});
