import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ChatList from "../../components/ChatList";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddUser from "../../components/AddUser";

export default function Home() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    if (!user?.userId) {
      console.log("User not logged in yet.");
      setLoading(false);
      return;
    }

    try {
      // Get the current user's document
      const currentUserDoc = await getDoc(doc(usersRef, user?.userId));
      const friendIds = currentUserDoc.data()?.friends || [];

      if (friendIds.length > 0) {
        // Query to fetch all friends' profiles
        const userQry = query(usersRef, where("userId", "in", friendIds));
        const userSnapShot = await getDocs(userQry);

        let data = [];
        userSnapShot.forEach((doc) => {
          data.push({ ...doc.data() });
        });

        
        setUsers(data);
      } else {
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users: ", error);
      setLoading(false);
    }
  };

  // Fetch users when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (user?.userId) {
        getUsers(); // Trigger getUsers whenever the user is available or changes
      }
    }, [user])
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {loading ? (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      ) : users.length > 0 ? (
        <ChatList currentUser={user} users={users} />
      ) : (
        <Text className="text-center mt-10">No users available</Text>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        className="bg-indigo-500"
        style={styles.touchBtn}
        onPress={() => setShowModal(true)}
      >
        <MaterialCommunityIcons name="plus" size={hp(4)} color="#fff" />
      </TouchableOpacity>

      <AddUser
        modalVisible={showModal}
        setModalVisible={setShowModal}
        refreshUsers={getUsers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  touchBtn: {
    position: "absolute",
    bottom: hp(2.5),
    right: wp(5),
    width: hp(6.5),
    height: hp(6.5),
    borderRadius: hp(3.25),
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "green",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
