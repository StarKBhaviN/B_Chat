import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
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

export default function Profile() {
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
          <Image source={{ uri: userData?.profileURL }} style={styles.profileImage} />
        </View>

        {/* Profile Name */}
        <Text style={styles.profileName}>{userData?.profileName || "No Name"}</Text>

        {/* User Email */}
        <Text style={styles.email}>{userData?.email || "No Email"}</Text>

        {/* Friends Count */}
        <View style={styles.friendsContainer}>
          <Text style={styles.friendsText}>
            Friends: {userData?.friends?.length > 0 ? userData.friends.length : 0}
          </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    width: wp(85),
    padding: 20,
    backgroundColor: "#fff",
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
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  friendsContainer: {
    marginBottom: 20,
  },
  friendsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  backButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
