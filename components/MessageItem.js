import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MessageOpModal from "./MessageOpModal";
import { ThemeContext } from "../context/ThemeContext";
import { db } from "../firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function MessageItem({ message, currentUser, roomId}) {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const [expanded, setExpanded] = useState(false);
  const [visibleLines, setVisibleLines] = useState(8);
  const [showOpModal, setShowOpModal] = useState(false);
  const [textHeight, setTextHeight] = useState(0);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const textRef = useRef(null);
  const bubbleRef = useRef(null);

  const LINES_TO_SHOW = 8;
  const LINES_INCREMENT = 8;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const handleLongPress = () => {
    bubbleRef.current.measure((x, y, width, height, pageX, pageY) => {
      console.log(x, y, width, height, pageX, pageY);
      let leftPos = pageX;
      let topPos = pageY;
      // Prevent modal from overflowing the screen on the right side
      if (leftPos + 220 > screenWidth) {
        leftPos = screenWidth - 220; // Adjust to ensure it fits within the screen
      }

      if (pageY + 200 > screenHeight) {
        topPos = screenHeight - height - 220;
      }

      setModalPosition({ top: topPos + 20, left: leftPos });
      setShowOpModal(true);
    });
  };

  useEffect(() => {
    if (textRef.current) {
      textRef.current.measure((x, y, width, height) => {
        const singleLineHeight = hp(2.5);
        const totalLines = height / singleLineHeight;
        if (totalLines > LINES_TO_SHOW) {
          setTextHeight(totalLines);
        }
      });
    }
  }, [message?.text]);

  const handleExpand = () => {
    if (visibleLines + LINES_INCREMENT >= textHeight) {
      setExpanded(true);
      setVisibleLines(textHeight);
    } else {
      setVisibleLines(visibleLines + LINES_INCREMENT);
    }
  };

  const handleCollapse = () => {
    setExpanded(false);
    setVisibleLines(LINES_TO_SHOW);
  };

  const formatTimestamp = (timestamp) => {
    const { seconds, nanoseconds } = timestamp;
    const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1e6);
    const date = new Date(milliseconds);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "P.M." : "A.M.";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  const deleteMessageFromFirestore = async (messageId) => {
    try {
      // Create a query to find the message based on its unique property (e.g., text)
      const messagesRef = collection(db, `rooms/${roomId}/messages`);
      const q = query(messagesRef, where("messageId", "==", messageId)); // Replace "text" with any other unique field if needed

      // Get documents matching the query
      const querySnapshot = await getDocs(q);

      // If document exists, proceed with deletion
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnap) => {
          // Retrieve the FirebaseGeneratedId (doc.id) from the document snapshot
          const messageId = docSnap.id;

          console.log("Found message with ID:", messageId);

          // Delete the document using the FirebaseGeneratedId
          const messageRef = doc(db, `rooms/${roomId}/messages/${messageId}`);
          await deleteDoc(messageRef);
        });
      } else {
        console.log("No message found with the given id.");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleDelete = async (messageId) => {
    console.log("Deleting : ", messageId);
    await deleteMessageFromFirestore(messageId);
  };

  if (currentUser?.userId === message?.userId) {
    return (
      <TouchableWithoutFeedback onLongPress={handleLongPress}>
        <View className="flex-row justify-end mb-3 mr-3">
          <View style={{ width: wp(80) }}>
            <View
              ref={bubbleRef}
              style={[
                styles.messageBubble,
                {
                  backgroundColor: colorScheme === "dark" ? "#0B192C" : "white",
                },
              ]}
              className="flex self-end p-3 rounded-2xl border border-neutral-500"
            >
              <Text
                ref={textRef}
                style={styles.messageText}
                numberOfLines={expanded ? undefined : visibleLines}
                ellipsizeMode="tail"
              >
                {message?.text}
              </Text>

              {textHeight > LINES_TO_SHOW && (
                <Pressable onPress={expanded ? handleCollapse : handleExpand}>
                  <Text style={styles.readMore}>
                    {expanded ? "Read Less" : "Read More"}
                  </Text>
                </Pressable>
              )}

              <Text style={styles.timeFont} className="flex self-end">
                {formatTimestamp(message?.localSendTime)}
              </Text>
            </View>
            
          </View>

          {showOpModal && (
            <TouchableWithoutFeedback onPress={() => setShowOpModal(false)}>
              <View style={StyleSheet.absoluteFill}>
                <View style={[styles.modalContainer, modalPosition]}>
                  <MessageOpModal
                    setModalVisible={setShowOpModal}
                    modalVisible={showOpModal}
                    modalPosition={modalPosition}
                    messageData={message}
                    showReadStatus={true}
                    handleDelete={handleDelete}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  } else {
    return (
      <TouchableWithoutFeedback onLongPress={handleLongPress}>
        <View style={{ width: wp(80) }} className="ml-3 mb-3">
          <View
            ref={bubbleRef}
            style={[
              styles.messageBubble,
              {
                backgroundColor: colorScheme === "dark" ? "#092635" : "#ebf4ff",
              },
            ]}
            className="flex self-start p-3 rounded-2xl border border-neutral-500"
          >
            <Text
              ref={textRef}
              style={styles.messageText}
              numberOfLines={expanded ? undefined : visibleLines}
              ellipsizeMode="tail"
            >
              {message?.text}
            </Text>

            {textHeight > LINES_TO_SHOW && (
              <Pressable onPress={expanded ? handleCollapse : handleExpand}>
                <Text style={styles.readMore}>
                  {expanded ? "Read Less" : "Read More"}
                </Text>
              </Pressable>
            )}

            <Text style={styles.timeFont}>
              {formatTimestamp(message?.localSendTime)}
            </Text>
          </View>
          {showOpModal && (
            <TouchableWithoutFeedback onPress={() => setShowOpModal(false)}>
              <View style={StyleSheet.absoluteFill}>
                <View style={[styles.modalContainer, modalPosition]}>
                  <MessageOpModal
                    setModalVisible={setShowOpModal}
                    modalVisible={showOpModal}
                    modalPosition={modalPosition}
                    messageData={message}
                    showReadStatus={false}
                    handleDelete={handleDelete}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    messageText: {
      color: theme.glow,
      fontSize: hp(1.9),
      lineHeight: hp(2.5),
    },
    readMore: {
      color: "blue",
      marginTop: 0,
      fontSize: hp(1.6),
    },
    messageBubble: {
      paddingVertical: 9,
      paddingHorizontal: 9,
      maxWidth: wp(70),
    },
    timeFont: {
      fontSize: hp(1.2),
      color: "gray",
      marginTop: 2,
    },
    modalContainer: {
      position: "absolute",
      zIndex: 10,
    },
  });
}
