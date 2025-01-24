import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";
import Profile from "./profile"; // Import the Profile component

export default function UserProfile() {
  const { userId } = useLocalSearchParams(); // Fetch the dynamic userId from the URL
  const [userData, setUserData] = useState(null);

  const fetchUserData = async (id) => {
    if (id) {
      try {
        const userDoc = await getDoc(doc(usersRef, id));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return <Profile externalUserData={userData} userId={userId} />;
}
