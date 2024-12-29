import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const textRef = useRef("");
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    createRommIfNotExist();

    let roomId = getRoomID(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => doc.data());
      setMessages([...allMessages]);
    });

    const KeyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow', updateScrollView
    );

    return () => {
      unsub();
      KeyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const createRommIfNotExist = async () => {
    let roomId = getRoomID(user?.userId, item?.userId);
    try {
      await setDoc(doc(db, "rooms", roomId), {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
      });
      console.log("Room created successfully!");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) {
      console.log("No message");
      return;
    }
    try {
      let roomId = getRoomID(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");

      // Clear the input field immediately
      textRef.current = "";
      if (inputRef.current) {
        inputRef.current.clear();
        inputRef.current.focus();  // Maintain focus to keep keyboard open
      }

      await addDoc(messagesRef, {
        userId: user?.userId,
        text: message,
        profileURL: user?.profileURL,
        senderName: user?.profileName,
        createdAt: Timestamp.fromDate(new Date()),
      });

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1 bg-white">
        <StatusBar styles="dark" />
        <ChatRoomHeader user={item} router={router} />
        <View className="h-2 border-b border-neutral-300" />
        <View className="flex-1 justify-content bg-neutral-100 overflow-visible">
          <MessageList
            scrollViewRef={scrollViewRef}
            messages={messages}
            currentUser={user}
          />
          <View style={{ marginBottom: hp(2.7) }} className="pt-2">
            <View className="flex-row mx-3 justify-between bg-white border p-1 border-neutral-300 rounded-full pl-3">
              <TextInput
                ref={inputRef}
                onChangeText={(value) => (textRef.current = value)}
                placeholder="Type Message..."
                style={{ fontSize: hp(1.8) }}
                className="flex-1 mr-2"
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}  // Sends on "Enter"
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                className="bg-neutral-200 p-2 mr-[1px] rounded-full"
              >
                <MaterialCommunityIcons
                  name="send"
                  size={hp(2.7)}
                  color={"#737373"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
