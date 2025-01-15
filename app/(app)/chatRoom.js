import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatRoomHeader from "../../components/ChatRoomHeader";
import MessageList from "../../components/MessageList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import { useAuth } from "../../context/authContext";
import { getRoomID } from "../../utils/common";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";
import { sendPushNotification } from "../../utils/pushNotification";

export default function ChatRoom() {
  const { theme, colorScheme } = useContext(ThemeContext);

  const item = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inChat, setInChat] = useState(false);
  const textRef = useRef("");
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);
  let typingTimeout;

  useEffect(() => {
    createRoomIfNotExist();
    fetchMessages();
    markMessagesAsRead(); // Mark messages as read when entering the room

    const KeyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );

    return () => {
      KeyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const fetchMessages = () => {
    let roomId = getRoomID(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(
      q,
      (snapshot) => {
        let allMessages = snapshot.docs.map((doc) => {
          let data = doc.data();
          return {
            ...data,
            createdAt: data.createdAt || Timestamp.now(),
          };
        });

        allMessages.sort(
          (a, b) => a.createdAt?.toMillis() - b.createdAt?.toMillis()
        );
        setMessages([...allMessages]);
      },
      (error) => {
        console.log("Error chatRoom fetchMessages : ", error);
      }
    );

    return () => unsub();
  };

  const markMessagesAsRead = async () => {
    // Get room id for checking that messages
    let roomId = getRoomID(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");

    try {
      // Get all unread messages
      const unreadQuery = query(
        messagesRef,
        where("userId", "==", item?.userId), // Target messages sent by the friend
        where("isReaded", "==", false)
      );

      const unreadSnapshot = await getDocs(unreadQuery);

      if (unreadSnapshot.empty) {
        console.log("No unread messages found!");
        return;
      }

      // console.log(`Found ${unreadSnapshot.size} unread messages`);

      // Use batch write to improve performance
      const batch = writeBatch(db);

      unreadSnapshot.forEach((messageDoc) => {
        const messageRef = doc(messagesRef, messageDoc.id);
        batch.update(messageRef, { isReaded: true });
      });

      await batch.commit();
      console.log("All messages marked as read.");
    } catch (error) {
      console.error("Error marking messages as read: ", error);
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const createRoomIfNotExist = async () => {
    let roomId = getRoomID(user?.userId, item?.userId);
    try {
      await setDoc(doc(db, "rooms", roomId), {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    setIsTyping(false);

    try {
      let roomId = getRoomID(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");

      textRef.current = "";

      if (inputRef.current) {
        inputRef.current.clear();
        inputRef.current.focus();
      }

      const messageData = {
        userId: user?.userId,
        text: message,
        profileURL: user?.profileURL,
        senderName: user?.profileName,
        createdAt: serverTimestamp(),
        localSendTime: new Date(),
        isReaded: false,
      };

      const newMessageRef = await addDoc(messagesRef, messageData);

      // Immediately mark as read if the recipient is in the same room
      const recipientRef = doc(db, "users", item?.userId);
      const recipientSnap = await getDoc(recipientRef);

      if (recipientSnap.exists()) {
        const recipientData = recipientSnap.data();
  
        // console.log(recipientData.pushToken)
        if (recipientData.activeRoom === roomId) {
          // Mark the message as read if recipient is in the same room
          await updateDoc(newMessageRef, { isReaded: true });
        } else if (recipientData.pushToken) {
          // Send a push notification if recipient is not in the same room
          await sendPushNotification(
            recipientData.pushToken,
            `${user?.profileName}`,
            `${message}`, // Notification title and body
            { roomId } // Optional payload data
          );
        }
      }
  
      // if (
      //   recipientSnap.exists() &&
      //   recipientSnap.data().activeRoom === roomId
      // ) {
      //   await updateDoc(newMessageRef, { isReaded: true });
      // }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Users Presence in active room
  const updateActiveRoom = async (roomId) => {
    if (user?.userId) {
      const userRef = doc(db, "users", user?.userId);
      await updateDoc(userRef, {
        activeRoom: roomId,
        lastSeen: serverTimestamp(),
      });
    }
  };

  const clearActiveRoom = async () => {
    if (user?.userId) {
      const userRef = doc(db, "users", user?.userId);
      await updateDoc(userRef, {
        activeRoom: null,
        lastSeen: serverTimestamp(),
      });
    }
  };
  const updateTypingStatus = (isTyping) => {
    if (user?.userId) {
      const userRef = doc(db, "users", user?.userId);
      clearTimeout(typingTimeout);

      // Set typing to true
      if (isTyping) {
        updateDoc(userRef, {
          isTyping: true,
          activeRoom: getRoomID(user?.userId, item?.userId),
        });

        // Reset typing status after 3 seconds of inactivity
        typingTimeout = setTimeout(() => {
          updateDoc(userRef, { isTyping: false });
        }, 1500);
      } else {
        // Directly set to false when typing stops
        updateDoc(userRef, { isTyping: false });
      }
    }
  };

  useEffect(() => {
    let roomId = getRoomID(user?.userId, item?.userId);
    updateActiveRoom(roomId); // Mark as active in the room

    return () => {
      clearActiveRoom(); // Clear on leaving room
    };
  }, []);

  useEffect(() => {
    let roomId = getRoomID(user?.userId, item?.userId);
    const recipientRef = doc(db, "users", item?.userId);

    const unsub = onSnapshot(recipientRef, async (snapshot) => {
      const data = snapshot.data();

      if (data?.activeRoom === roomId) {
        await markMessagesAsRead(); // Mark messages as read in real-time
      }
    });

    return () => unsub();
  }, []);

  // Listen for changes in friend's typing status
  useEffect(() => {
    const friendRef = doc(db, "users", item?.userId);
    const unsub = onSnapshot(friendRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.activeRoom === getRoomID(user?.userId, item?.userId)) {
        setIsTyping(data.isTyping);
      } else {
        setIsTyping(false);
      }
    });

    return () => unsub();
  }, [item?.userId]);

  return (
    <CustomKeyboardView inChat={inChat} setInChat={setInChat}>
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <ChatRoomHeader user={item} router={router} />
        <View
          className="h-1 border-b"
          style={{
            borderColor: colorScheme === "dark" ? "#3A3B3A" : "#A8A9A8",
          }}
        />
        <View
          className="flex-1 justify-content overflow-visible"
          style={{
            backgroundColor: colorScheme === "dark" ? "#1B1A22" : "#F5F5F5",
          }}
        >
          <MessageList
            scrollViewRef={scrollViewRef}
            messages={messages}
            currentUser={user}
            isTyping={isTyping}
          />

          <View style={{ marginBottom: hp(2.5) }} className="pt-2">
            <View
              className="flex-row mx-3 justify-between items-center p-1 border border-neutral-300 rounded-full pl-3"
              style={{
                backgroundColor: colorScheme === "dark" ? theme.tint : "white",
                borderColor: colorScheme === "dark" ? "#2D2D2C" : theme.border,
              }}
            >
              <TextInput
                ref={inputRef}
                onChangeText={(value) => {
                  textRef.current = value;
                  updateTypingStatus(value.length > 0);
                }}
                placeholder="Type Message..."
                placeholderTextColor={theme.placeholder}
                style={{
                  fontSize: hp(1.9),
                  color: theme.glow,
                  // textOverflow: "wrap",
                  // minHeight: hp(3), // Minimum height for the input field
                  maxHeight: hp(6), // Maximum height to allow only 2-3 lines
                  flex: 1, // Allow the input to expand
                  textAlignVertical: "top",
                  lineHeight: hp(3),
                }}
                multiline={true}
                className="flex-1 mr-2"
                maxLength={600}
                returnKeyType="send"
                onSubmitEditing={handleSendMessage} // Sends on "Enter"
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                className="p-2 mr-[1px] rounded-full items-center justify-center"
                style={{
                  height: hp(6),
                  width: hp(6),
                  backgroundColor:
                    colorScheme === "dark" ? "#1B1A22" : "#E8E9EA",
                }}
              >
                <MaterialCommunityIcons
                  name="send"
                  size={hp(2.7)}
                  color={theme.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
