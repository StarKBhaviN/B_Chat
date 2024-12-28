import {
  View,
  Text,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ChatList from "../../components/ChatList";
import { getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";

export default function Home() {
  const { logout, user } = useAuth();
  const [users, setusers] = useState([1, 2, 3]);

  useEffect(() => {
    if (user?.uid)
      getUsers();
  }, []);

  const getUsers = async () => {
    // Fetch users
    const qry = query(usersRef, where("userId", "!=", user?.uid)); // Gets currently logged in users

    const qrySnapShot = await getDocs(qry);
    let data = [];
    qrySnapShot.forEach((doc) => {
      data.push({ ...doc.data() });
    });

    console.log("Got Users : ", data);
  };
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {users.length > 0 ? (
        <ChatList users={users} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
