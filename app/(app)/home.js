import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/authContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ChatList from "../../components/ChatList";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { roomsRef, usersRef } from "../../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddUser from "../../components/AddUser";
import { getRoomID } from "../../utils/common";

export default function Home() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true);
  const listeners = useRef(new Map()); // Store listeners
  const messageListeners = useRef(new Map()); // For chat updates

  // Initial friend list fetch
  const fetchInitialUsers = async () => {
    if (!user?.userId) return;
    
    const currentUserDoc = await getDoc(doc(usersRef, user?.userId));
    const friendIds = currentUserDoc.data()?.friends || [];
    
    if (friendIds.length === 0) {
      setUsers([]);
      setLoading(false);
      return;
    }

    const userQry = query(usersRef, where("userId", "in", friendIds));
    const snapshot = await getDocs(userQry);
    
    let initialUsers = [];
    snapshot.forEach((doc) => {
      initialUsers.push({ ...doc.data() });
    });

    // Fetch last messages and set listeners
    const usersWithLastMessage = await Promise.all(
      initialUsers.map(async (friend) => {
        let roomId = getRoomID(user?.userId, friend.userId);
        const messagesRef = collection(doc(roomsRef, roomId), "messages");
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

        const lastMessageSnap = await getDocs(q);
        let lastMessage = lastMessageSnap.docs[0]?.data();
        
        // Listen for message updates in real-time
        if (!messageListeners.current.has(roomId)) {
          const unsub = onSnapshot(q, (snap) => {
            const newMessage = snap.docs[0]?.data();

            setUsers((prevUsers) => {
              const updatedUsers = prevUsers.map((u) =>
                u.userId === friend.userId
                  ? { ...u, lastMessage: newMessage }
                  : u
              );

              // Re-sort by latest message dynamically
              updatedUsers.sort((a, b) => {
                const aTime = a.lastMessage?.createdAt?.seconds || 0;
                const bTime = b.lastMessage?.createdAt?.seconds || 0;
                return bTime - aTime;
              });
              return [...updatedUsers];
            });
          });
          messageListeners.current.set(roomId, unsub);
        }

        return { ...friend, lastMessage };
      })
    );

    setUsers(usersWithLastMessage);
    setLoading(false);
  };

  // Real-time status listener
  const listenToFriendStatus = (friendIds) => {
    friendIds.forEach((friendId) => {
      if (!listeners.current.has(friendId)) {
        const unsub = onSnapshot(doc(usersRef, friendId), (docSnap) => {
          const updatedUser = docSnap.data();
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.userId === friendId ? { ...u, ...updatedUser } : u
            )
          );
        });
        listeners.current.set(friendId, unsub);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchInitialUsers().then(() => {
        const unsubscribe = onSnapshot(
          doc(usersRef, user?.userId),
          (docSnap) => {
            const friendIds = docSnap.data()?.friends || [];
            listenToFriendStatus(friendIds);
          }
        );

        return () => {
          unsubscribe();
          listeners.current.forEach((unsub) => unsub());
          listeners.current.clear();
          messageListeners.current.forEach((unsub) => unsub());
          messageListeners.current.clear();
        };
      });
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
        refreshUsers={fetchInitialUsers}
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
