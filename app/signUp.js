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
import { Entypo, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { useAuth } from "../context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

export default function SignUp() {
  // Import theme context for using theme
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [finalImage, setFinalImage] = useState("");

  const emailRef = useRef();
  const passRef = useRef();
  const bioRef = useRef();
  const userNameRef = useRef();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Upload Image to Cloudinary
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first.");
      return;
    }

    const data = new FormData();
    data.append("file", {
      uri: image,
      type: "image/*",
      name: "profile.jpg",
    });
    data.append("upload_preset", "B_Chat"); // Replace with your Cloudinary preset

    setUploading(true);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dzjyqifhh/image/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.secure_url;
      setFinalImage(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Upload Error: ", error);
      Alert.alert("Upload Failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async () => {
    if (
      !emailRef.current?.trim() ||
      !passRef.current?.trim() ||
      !userNameRef.current?.trim()
    ) {
      Alert.alert("Sign Up", "Please fill all the fields!!");
      return;
    }

    setLoading(true);

    // Wait for image upload
    const uploadedImageUrl = await uploadImage();

    if (!uploadedImageUrl) {
      Alert.alert("Sign Up", "Image upload failed. Please try again.");
      setLoading(false);
      return;
    }

    let resp = await register(
      emailRef.current,
      passRef.current,
      userNameRef.current,
      uploadedImageUrl,
      bioRef.current
    );

    setLoading(false);

    if (!resp.success) {
      Alert.alert("Sign Up", resp.msg);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={styles.safeContent}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <View style={{ paddingHorizontal: wp(6) }} className="gap-6">
          <View className="items-center">
            <Image
              style={{ height: hp(30) }}
              source={require("../assets/images/Auth/SignIn_bg.jpg")}
            />
          </View>

          <View className="gap-4">
            <Text
              style={[styles.myFont, { fontSize: hp(4), color: theme.glow }]}
              className="font-bol tracking-wider text-center "
            >
              Sign Up
            </Text>

            {/* Inputs */}
            <View className="gap-3">
              {/* Name Input */}
              <View className="gap-3">
                <View
                  style={{ height: hp(7), backgroundColor: theme.tint }}
                  className="flex-row px-4 gap-3 items-center rounded-2xl p-2 bg-gray-400"
                >
                  <Octicons
                    name="people"
                    style={{ width: wp(6.6), textAlign: "center" }}
                    size={hp(2.7)}
                    color={theme.icon}
                  />
                  <TextInput
                    onChangeText={(value) =>
                      (userNameRef.current = value || "")
                    }
                    style={{ fontSize: hp(2), color: theme.text }}
                    className="flex-1 font-semibold"
                    placeholder="Name"
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View
                style={{ height: hp(7), backgroundColor: theme.tint }}
                className="flex-row px-4 gap-3 items-center rounded-2xl p-2 bg-gray-400"
              >
                <Octicons
                  name="mail"
                  style={{ width: wp(6.6), textAlign: "center" }}
                  size={hp(2.7)}
                  color={theme.icon}
                />
                <TextInput
                  onChangeText={(value) => (emailRef.current = value || "")}
                  style={{ fontSize: hp(2), color: theme.text }}
                  className="flex-1 font-semibold"
                  placeholder="Email Address"
                  placeholderTextColor={theme.placeholder}
                />
              </View>

              {/* Password Input */}
              <View className="gap-3">
                <View
                  style={{ height: hp(7), backgroundColor: theme.tint }}
                  className="flex-row px-4 gap-3 items-center rounded-2xl p-2 bg-gray-400"
                >
                  <Octicons
                    name="lock"
                    style={{ width: wp(6.6), textAlign: "center" }}
                    size={hp(2.7)}
                    color={theme.icon}
                  />
                  <TextInput
                    onChangeText={(value) => (passRef.current = value || "")}
                    style={{ fontSize: hp(2), color: theme.text }}
                    className="flex-1 font-semibold"
                    placeholder="Password"
                    secureTextEntry={showPass}
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
              </View>

              {/* Bio Input */}
              <View className="gap-3">
                <View
                  style={{ height: hp(7), backgroundColor: theme.tint }}
                  className="flex-row px-4 gap-3 items-center rounded-2xl p-2 bg-gray-400"
                >
                  <MaterialIcons
                    name="photo-filter"
                    style={{ width: wp(6.6), textAlign: "center" }}
                    size={hp(2.7)}
                    color={theme.icon}
                  />
                  <TextInput
                    onChangeText={(value) => (bioRef.current = value || "")}
                    style={{ fontSize: hp(2), color: theme.text }}
                    className="flex-1 font-semibold"
                    placeholder="Add Bio"
                    multiline
                    secureTextEntry={showPass}
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>

              {/* Profile pic input */}
              <View className="gap-3">
                <View
                  style={{ height: hp(7), backgroundColor: theme.tint }}
                  className="flex-row px-4 gap-3 items-center rounded-2xl p-2 bg-gray-400"
                >
                  <Octicons
                    name="image"
                    style={{ width: wp(6.6), textAlign: "center" }}
                    size={hp(2.7)}
                    color={theme.icon}
                  />
                  {/* <TextInput
                    onChangeText={(value) => (profileURLRef.current = value)}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold text-neutral-700"
                    placeholder="Profile URL"
                    placeholderTextColor={"gray"}
                  /> */}
                  <TouchableOpacity onPress={pickImage} className="flex-1">
                    <Text
                      style={{ fontSize: hp(2), color: theme.text }}
                      className="font-semibold text-neutral-700"
                    >
                      {image ? "Change Profile Picture" : "Pick Profile Image"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <View>
                {loading ? (
                  <View className="flex-row justify-center">
                    <Loading size={hp(7)} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleRegister}
                    style={{ height: hp(6), backgroundColor: theme.specialBg }}
                    className="mt-2 rounded-xl justify-center items-center"
                  >
                    <Text
                      style={{ fontSize: hp(2.7), color: theme.glow }}
                      className="font-bold tracking-wider"
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* SignUp Text */}
              <View className="flex-row justify-center">
                <Text
                  style={{ fontSize: hp(1.8), color: theme.placeholder }}
                  className="font-semibold"
                >
                  Already Have an Account?{" "}
                </Text>
                <Pressable onPress={() => router.push("signIn")}>
                  <Text
                    style={{ fontSize: hp(1.8), color: theme.glow }}
                    className="font-semibold"
                  >
                    Sign In
                  </Text>
                </Pressable>
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
  });
}
