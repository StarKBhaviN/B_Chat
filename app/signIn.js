import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Entypo, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlayfairDisplay_500Medium } from "@expo-google-fonts/dev";
import { useFonts } from "expo-font";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import ForgotPassword from "../components/ForgotPassword";
import PhoneSignIn from "../components/PhoneSignIn.js";
import CustomKeyboardView from "../components/CustomKeyboardView.js";
import { ThemeContext } from "../context/ThemeContext.js";

export default function SignIn() {
  // Import theme context for using theme
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const router = useRouter();
  const { login } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [phonemodalVisible, setPhoneModalVisible] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <SafeAreaView className="flex-1" style={styles.safeContent}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}
    keyboardShouldPersistTaps="handled"
    bounces={false}
    showsVerticalScrollIndicator={false} >
        <View style={{ paddingHorizontal: wp(6) }} className="flex-1 gap-6 ">
          <View className="items-center">
            <Image
              style={{ height: hp(30) }}
              source={require("../assets/images/Auth/SignIn_bg.jpg")}
            />
          </View>

          <View className="gap-4">
            <Text
              style={[styles.myFont, { fontSize: hp(4), color: theme.glow }]}
              className="font-bold tracking-wider text-center"
            >
              Sign In
            </Text>

            {/* Inputs */}
            <View className="gap-3">
              {/* Mail */}
              <View
                style={{ height: hp(7), backgroundColor: theme.tint }}
                className="flex-row px-4 gap-3 items-center rounded-2xl"
              >
                <Octicons
                  name="mail"
                  size={hp(2.7)}
                  color={theme.icon}
                  style={{ width: wp(6.6), textAlign: "center" }}
                />
                <TextInput
                  onChangeText={(value) => (emailRef.current = value)}
                  style={{ fontSize: hp(2), color: theme.text }}
                  className="flex-1 font-semibold"
                  placeholder="Email Address"
                  placeholderTextColor={theme.placeholder}
                />
              </View>

              {/* Password */}
              <View className="gap-3">
                <View
                  style={{ height: hp(7), backgroundColor: theme.tint }}
                  className="flex-row px-4 gap-3 items-center rounded-2xl"
                >
                  <Octicons
                    name="lock"
                    size={hp(2.7)}
                    color={theme.icon}
                    style={{ width: wp(6.6), textAlign: "center" }}
                  />
                  <TextInput
                    onChangeText={(value) => (passRef.current = value)}
                    style={{ fontSize: hp(2), color: theme.text }}
                    className="flex-1 font-semibold"
                    placeholder="Password"
                    secureTextEntry={!showPass}
                    placeholderTextColor={theme.placeholder}
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Entypo
                      name={showPass ? "eye" : "eye-with-line"}
                      size={hp(2.7)}
                      color={theme.icon}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text
                    style={{ fontSize: hp(1.8), color: theme.text }}
                    className="font-semibold text-right"
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <View className="mt-0">
                  {loading ? (
                    <View className="flex-row justify-center">
                      <Loading size={hp(7)} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handleLogin}
                      style={{ height: hp(6), backgroundColor: theme.specialBg }}
                      className="rounded-xl justify-center items-center"
                    >
                      <Text
                        style={{ fontSize: hp(2.7), color: theme.glow }}
                        className="font-bold tracking-wider"
                      >
                        Sign In
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View>
                <ForgotPassword
                  setModalVisible={setModalVisible}
                  modalVisible={modalVisible}
                />
              </View>

              {/* SignUp Text */}
              <View className="flex-row justify-center">
                <Text
                  style={{ fontSize: hp(1.8), color: theme.placeholder }}
                  className="font-semibold"
                >
                  Don't Have an Account?{" "}
                </Text>
                <Pressable onPress={() => router.push("signUp")}>
                  <Text
                    style={{ fontSize: hp(1.8), color : theme.glow }}
                    className="font-semibold"
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </View>

              <View className="gap-1 flex-column items-center">
                <Text
                  style={{ fontSize: hp(1.8), color: theme.text }}
                  className="mb-2 font-semibold"
                >
                  OR{" "}
                </Text>
                <Pressable
                  className="p-4 rounded-2xl px-6 flex-row items-center"
                  style={[styles.googleButton, { backgroundColor: theme.tint }]}
                  onPress={() => Alert.alert("SignIn", "Coming Soon!!!")}
                >
                  <AntDesign name="google" size={22} color={"orange"} />
                  <Text
                    style={{ fontSize: hp(1.7), color : theme.text }}
                    className="font-semibold mx-2"
                  >
                    Sign-In with Google
                  </Text>
                </Pressable>
                <Pressable
                  className="mt-2 p-4 rounded-2xl px-6 flex-row items-center"
                  style={[styles.googleButton, { backgroundColor: theme.tint }]}
                  onPress={() => setPhoneModalVisible(true)}
                >
                  <AntDesign name="phone" size={22} color={"green"} />
                  <Text
                    style={{ fontSize: hp(1.7), color : theme.text }}
                    className="font-semibold mx-2"
                  >
                    Sign-In with Phone
                  </Text>
                </Pressable>
                <View>
                  <PhoneSignIn
                    setModalVisible={setPhoneModalVisible}
                    modalVisible={phonemodalVisible}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    safeContent: {
      backgroundColor: theme.background,
    },
    myFont: {
      fontFamily: "PlayfairDisplay_500Medium",
    },
    googleButton: {
      // height : hp(4),
      backgroundColor: "white",
      boxShadow: "1px 1px 4px black",
    },
  });
}
