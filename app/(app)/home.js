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
import { Image } from "expo-image";
import HelloBee from "../../assets/images/HelloBee.png";
import { useFriendContext } from "../../context/friendContext";
import ImageEnlarger from "../../components/Custom/ImageEnlarger";
// import { useNotification } from "../../context/NotificationContext";

export default function Home() {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const { user } = useAuth();
  const { fetchAllFriends, getAllFriendDataWithMessages } = useFriendContext();

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // const listeners = useRef(new Map());
  // const messageListeners = useRef(new Map());
  // const unsubscribeUser = useRef(null);
  const dataFetched = useRef(false); // Flag to track if data is already fetched

  // Fetch friends and their last messages on first load
  const fetchFriends = async () => {
    // console.log("Started",user.userID);
    setLoading(true);
    await getAllFriendDataWithMessages(); // Fetch friends and messages
    // console.log("Stopped");
    setLoading(false);
  };

  useEffect(() => {
    // console.log("Fetch all :",fetchAllFriends)
    setUsers(fetchAllFriends);
  }, [fetchAllFriends]);

  // Optimize listening to message updates
  const listenToFriendMessages = useCallback(() => {
    fetchAllFriends.forEach((friend) => {
      const roomId = getRoomID(user.userId, friend.userId);
      const messagesRef = collection(doc(roomsRef, roomId), "messages");
      const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

      onSnapshot(q, (snap) => {
        const newMessage = snap.docs[0]?.data();
        setUsers((prevUsers) => {
          return prevUsers.map((u) =>
            u.userId === friend.userId ? { ...u, lastMessage: newMessage } : u
          );
        });
      });
    });
  }, [fetchAllFriends, user?.userId]);

  // Sort the friends based on last message time
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aTime = a.lastMessage?.createdAt?.seconds || 0;
      const bTime = b.lastMessage?.createdAt?.seconds || 0;
      return bTime - aTime;
    });
  }, [users]);

  useFocusEffect(
    useCallback(() => {
      // Define an async function inside the callback
      const fetchData = async () => {
        // console.log("Running this", user?.userId);

        if (user?.userId && !dataFetched.current) {
          await fetchFriends();
          dataFetched.current = true;
        }

        // Start listening to friends' messages once fetched
        if (user && fetchAllFriends.length > 0) {
          listenToFriendMessages();
        }
      };

      fetchData();
    }, [user, fetchAllFriends, listenToFriendMessages])
  );

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
        <View style={styles.notFound}>
          <Image
            source={HelloBee}
            style={{ width: 200, height: 200, marginBottom: 10 }}
          />
          <Text
            className="text-xl text-center w-80"
            style={{ color: theme.text }}
          >
            No Friend Beez. Add Bee👋
          </Text>
        </View>
      )}

      {/* <ImageEnlarger /> */}
      <TouchableOpacity
        style={styles.touchBtn}
        onPress={() => setShowModal(true)}
      >
        <MaterialCommunityIcons name="plus" size={hp(4)} color="#fff" />
      </TouchableOpacity>

      <AddUser modalVisible={showModal} setModalVisible={setShowModal} />
    </View>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    touchBtn: {
      backgroundColor: "#2f3a4b",
      position: "absolute",
      bottom: hp(2.5),
      right: wp(5),
      width: hp(6.5),
      height: hp(6.5),
      borderRadius: hp(3.25),
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
    },
    notFound: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingVertical: 20,
    },
  });
}
