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
import { router } from "expo-router";
import { ThemeContext } from "../../context/ThemeContext";

export default function Profile() {
  const {theme, colorScheme} = useContext(ThemeContext)
  const styles = createStyles(theme, colorScheme);

  const { user } = useAuth(); // Using user data from AuthContext
  const [userData, setUserData] = useState(user); // Store user data separately

  // Fetch updated user data when the user context changes
  useEffect(() => {
    if (user?.userId) {
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

      fetchUserData();
    }
  }, [user]); // Trigger the effect whenever the user context changes

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: userData?.profileURL }}
            style={styles.profileImage}
          />
        </View>

        {/* Profile Name */}
        <Text style={styles.profileName}>
          {userData?.profileName || "No Name"}
        </Text>

        {/* User Email */}
        <Text style={styles.email}>{userData?.email || "No Email"}</Text>

        {/* Bio */}
        <View className="flex mb-2" style={{width : wp(70)}}>
          <Text style={{fontSize : 18, marginBottom : 2, color : theme.glow}}>Bio </Text>
          <View style={styles.bioView}>
            <Text style={styles.bioText}>
              {userData?.bio || "You have not added bio."}
            </Text>
          </View>
        </View>

        {/* Friends Count */}
        <View style={styles.friendsContainer}>
          <Text style={styles.friendsText}>
            Friends:{" "}
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
      backgroundColor: colorScheme==="dark" ? theme.tint : "white",
      borderRadius: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    profileImageContainer: {
      marginBottom: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    profileImage: {
      height: hp(15),
      width: hp(15),
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
      marginBottom: 10,
    },
    bioView : {
      borderWidth : 1,
      padding : 6,
      borderRadius : 10,
      backgroundColor : colorScheme==="dark" ? "#092635" : "#FAF0E6",
  
    },
    bioText: {
      fontSize: 16,
      color: theme.glow,
      marginBottom: 5,
    },
    friendsContainer: {
      marginBottom: 20,
    },
    friendsText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
  });
}
