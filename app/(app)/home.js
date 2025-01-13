import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  useContext,
} from "react";
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
import { ThemeContext } from "../../context/ThemeContext";

export default function Home() {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const listeners = useRef(new Map());
  const messageListeners = useRef(new Map());
  const unsubscribeUser = useRef(null);
  const dataFetched = useRef(false); // Flag to track if data is already fetched

  const addNewUser = (newFriend) => {
    setUsers((prevUsers) => [...prevUsers, newFriend]);
  };

  const fetchInitialUsers = async () => {
    if (!user?.userId || dataFetched.current) return;

    setLoading(true);
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

    const usersWithLastMessage = await Promise.all(
      initialUsers.map(async (friend) => {
        let roomId = getRoomID(user?.userId, friend.userId);
        const messagesRef = collection(doc(roomsRef, roomId), "messages");
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

        const lastMessageSnap = await getDocs(q);
        let lastMessage = lastMessageSnap.docs[0]?.data();

        if (!messageListeners.current.has(roomId)) {
          const unsub = onSnapshot(q, (snap) => {
            const newMessage = snap.docs[0]?.data();
            setUsers((prevUsers) => {
              const updatedUsers = prevUsers.map((u) =>
                u.userId === friend.userId
                  ? { ...u, lastMessage: newMessage }
                  : u
              );
              return updatedUsers;
            });
          });
          messageListeners.current.set(roomId, unsub);
        }

        return { ...friend, lastMessage };
      })
    );

    setUsers(usersWithLastMessage);
    dataFetched.current = true; // Mark data as fetched
    setLoading(false);
  };

  const listenToFriendStatus = (friendIds) => {
    friendIds.forEach((friendId) => {
      if (!listeners.current.has(friendId)) {
        const unsub = onSnapshot(doc(usersRef, friendId), (docSnap) => {
          const updatedUser = docSnap.data();
          setUsers((prevUsers) => {
            return prevUsers.map((u) =>
              u.userId === friendId ? { ...u, ...updatedUser } : u
            );
          });
        });
        listeners.current.set(friendId, unsub);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (!dataFetched.current) {
        fetchInitialUsers();
      }

      if (!unsubscribeUser.current && user?.userId) {
        unsubscribeUser.current = onSnapshot(
          doc(usersRef, user?.userId),
          (docSnap) => {
            const friendIds = docSnap.data()?.friends || [];
            listenToFriendStatus(friendIds);
          }
        );
      }

      return () => {
        // Unsubscribe only when component unmounts
        unsubscribeUser.current?.();
        unsubscribeUser.current = null;
      };
    }, [user])
  );

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aTime = a.lastMessage?.createdAt?.seconds || 0;
      const bTime = b.lastMessage?.createdAt?.seconds || 0;
      return bTime - aTime;
    });
  }, [users]);

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      {loading ? (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      ) : sortedUsers.length > 0 ? (
        <ChatList currentUser={user} users={sortedUsers} />
      ) : (
        <Text className="text-center mt-10">No users available</Text>
      )}

      <TouchableOpacity
        style={styles.touchBtn}
        onPress={() => setShowModal(true)}
      >
        <MaterialCommunityIcons name="plus" size={hp(4)} color="#fff" />
      </TouchableOpacity>

      <AddUser
        modalVisible={showModal}
        setModalVisible={setShowModal}
        addNewFriend={addNewUser}
      />
    </View>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    touchBtn: {
      backgroundColor : "#2f3a4b",
      position: "absolute",
      bottom: hp(2.5),
      right: wp(5),
      width: hp(6.5),
      height: hp(6.5),
      borderRadius: hp(3.25),
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
    },
  });
}
