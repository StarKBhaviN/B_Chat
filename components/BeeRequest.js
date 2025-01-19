import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/authContext";
import { getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { usersRef } from "../firebaseConfig";

export default function BeeRequest({ data }) {
  const { theme, colorScheme } = useContext(ThemeContext);
  const { user } = useAuth();

  const deleteFrndReqs = async (requestId) => {
    try {
      const userQry = query(usersRef, where("userId", "==", user?.userId));
      const snapshot = await getDocs(userQry);

      snapshot.forEach(async (docSnapshot) => {
        const docId = docSnapshot.id;
        const { friendReqs } = docSnapshot.data();

        const updatedFriendReqs = Array.isArray(friendReqs)
          ? friendReqs.filter((req) => req !== requestId)
          : [];

        await updateDoc(doc(usersRef, docId), {
          friendReqs: updatedFriendReqs,
        });
      });
    } catch (error) {
      console.error("Error deleting friend request: ", error);
    }
  };

  const acceptFrndReq = async (requestId) => {
    try {
      // Query the current user's document to update their friendReqs and friends fields
      const userQry = query(usersRef, where("userId", "==", user?.userId));
      const snapshot = await getDocs(userQry);
  
      snapshot.forEach(async (docSnapshot) => {
        const docId = docSnapshot.id;
        const { friendReqs = [], friends = [] } = docSnapshot.data();
  
        // Remove the requestId from friendReqs and add it to friends
        const updatedFriendReqs = friendReqs.filter((req) => req !== requestId);
        const updatedFriends = [...friends, requestId];
  
        // Update the current user's Firestore document
        await updateDoc(doc(usersRef, docId), {
          friendReqs: updatedFriendReqs,
          friends: updatedFriends,
        });
      });
  
      // Now, query the friend (request sender)'s document and update their friends list
      const senderQry = query(usersRef, where("userId", "==", requestId));
      const senderSnapshot = await getDocs(senderQry);
  
      senderSnapshot.forEach(async (docSnapshot) => {
        const docId = docSnapshot.id;
        const { friendReqs = [], friends = [] } = docSnapshot.data();
  
        // Remove the current user's ID from the friend's friendReqs
        const updatedFriendReqs = friendReqs.filter((req) => req !== user?.userId);
        const updatedFriends = [...friends, user?.userId];
  
        // Update the sender's Firestore document
        await updateDoc(doc(usersRef, docId), {
          friendReqs: updatedFriendReqs,
          friends: updatedFriends,
        });
      });
    } catch (error) {
      console.error("Error accepting friend request: ", error);
    }
  };

  const handleDelReq = () => {
    deleteFrndReqs(data.userId);
  };

  const handleAcceptReq = () => {
    acceptFrndReq(data.userId);
  };

  return (
    <View
      className="flex flex-row items-center border rounded-lg p-1 py-2 mb-2"
      style={{ borderColor: colorScheme === "dark" ? "#37373d" : "#484848" }}
    >
      <View className="me-2">
        <Image
          style={{
            height: hp(5),
            aspectRatio: 1,
            borderRadius: 100,
          }}
          source={
            data?.profileURL ||
            "https://media.istockphoto.com/id/938709362/photo/portrait-of-a-girl.jpg?s=612x612&w=0&k=20&c=UQGXpeiLrI78nO1B9peUn0D0fCSRrm-J8xohMWG2Lms="
          }
          placeholder={blurhash}
          transition={500}
        />
      </View>

      <View className="flex-1 flex-row items-center justify-between">
        <View style={{ maxWidth: wp(54) }}>
          <Text style={{ color: theme.glow, fontSize: 16 }}>
            {data?.profileName || "Profile Name"}
          </Text>
          <View style={{ maxHeight: hp(4.5) }}>
            <Text style={{ color: theme.text }}>
              {data?.sendReqMsg || "Announcements or Add friend messages"}
            </Text>
          </View>
        </View>

        <View className="me-1 flex-1 flex-col items-end">
          <TouchableOpacity onPress={handleDelReq}>
            <Entypo
              name="cross"
              size={18}
              color={theme.icon}
              className="mb-1"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAcceptReq}
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
