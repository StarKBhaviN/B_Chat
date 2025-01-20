import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StyleSheet } from "react-native";
import { useAuth } from "../../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import ProfileEditModal from "../../components/ProfileEditModal";

export default function Profile() {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const { user, editProfile } = useAuth(); // Using user data from AuthContext
  const [userData, setUserData] = useState(user); // Store user data separately

  const [showEditModal, setShowEditModal] = useState(false);
  const [fieldName, setFieldName] = useState("");
  // Fetch the latest user data from Firebase when the user context changes
  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(usersRef, user?.userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data); // Update the userData state with the fetched data
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  // Fetch updated user data when the user context changes
  useEffect(() => {
    if (user?.userId) {
      fetchUserData();
    }
  }, [user]); // Trigger the effect whenever the user context changes

  const handlePickImage = () => {
    console.log("handle pick image");
  };

  const openNameEditModal = () => {
    setFieldName("Name");
    setShowEditModal(true);
  };

  const openBioEditModal = () => {
    setFieldName("Bio");
    setShowEditModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* User Email */}
        <Text style={styles.email}>{userData?.email || "No Email"}</Text>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: userData?.profileURL }}
            style={styles.profileImage}
          />
          <AntDesign
            onPress={handlePickImage}
            name="picture"
            size={22}
            color={"rgb(197, 196, 196)"}
            className="bg-[#2f3a4b] p-2 rounded-full"
            style={{ position: "absolute", bottom: 0, right: 0 }}
          />
        </View>

        {/* Profile Name */}
        <View className="flex mb-4" style={{ width: wp(70) }}>
          <View style={styles.bioView}>
            <Text
              style={{ fontSize: 16, marginBottom: 2, color: theme.glow }}
              className="font-bold"
            >
              Bee Name{" "}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text style={[styles.bioText]}>
                {userData?.profileName || "No Name"}
              </Text>
              <FontAwesome6
                onPress={openNameEditModal}
                name="pencil"
                size={15}
                color={theme.icon}
              />
            </View>
          </View>
        </View>
        <View>
          <ProfileEditModal
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            fieldName={fieldName}
            fetchUserData={fetchUserData}
          />
        </View>
        {/* Bio */}
        <View className="flex mb-2" style={{ width: wp(70) }}>
          <View style={styles.bioView}>
            <Text
              style={{ fontSize: 16, marginBottom: 2, color: theme.glow }}
              className="font-bold"
            >
              Achievements{" "}
            </Text>
            <View className="flex-row items-end justify-between">
              <Text style={styles.bioText}>
                {userData?.bio || "Add about yourself for Beez."}
              </Text>
              <FontAwesome
                onPress={openBioEditModal}
                className="mb-1"
                name="pencil-square-o"
                size={18}
                color={theme.icon}
              />
            </View>
          </View>
        </View>

        {/* Friends Count */}
        <View style={styles.friendsContainer}>
          <Text style={styles.friendsText}>
            Friend Beez :{" "}
            {userData?.friends?.length > 0 ? userData.friends.length : 0}
          </Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.appBg,
      justifyContent: "center",
      alignItems: "center",
    },
    profileCard: {
      width: wp(85),
      padding: 20,
      backgroundColor: colorScheme === "dark" ? theme.tint : "white",
      borderRadius: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    profileImageContainer: {
      flexDirection: "row",
      marginBottom: 18,
      justifyContent: "center",
      alignItems: "flex-end",
    },
    profileImage: {
      height: hp(17),
      width: hp(17),
      borderRadius: 100,
      resizeMode: "cover",
    },
    profileName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.glow,
      marginBottom: 5,
    },
    email: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 12,
    },
    bioView: {
      // borderWidth: 1,
      boxShadow: "1 1 3 black",
      padding: 6,
      borderRadius: 10,
      backgroundColor: colorScheme === "dark" ? "#092635" : "#FAF0E6",
    },
    bioText: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 2,
      width: "90%",
    },
    friendsContainer: {
      marginTop: 5,
    },
    friendsText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
  });
}
