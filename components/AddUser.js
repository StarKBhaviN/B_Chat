import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { useAuth } from "../context/authContext";
import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { usersRef } from "../firebaseConfig";
import { ThemeContext } from "../context/ThemeContext";

export default function AddUser({
  modalVisible,
  setModalVisible,
  addNewFriend,
}) {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const [frndProfile, setFrndProfile] = useState("");
  const [adding, setAdding] = useState(false); // State to track loading
  const { user } = useAuth();

  const handleAddFriend = async () => {
    if (!user || adding) {
      return;
    }
    setAdding(true); // Start loading

    try {
      // Step 1: Search for user by profile name
      const qry = query(usersRef, where("profileName", "==", frndProfile));
      const qrySnapShot = await getDocs(qry);

      if (qrySnapShot.empty) {
        Alert.alert("User Not Found");
        setAdding(false);
        return;
      }

      const friend = qrySnapShot.docs[0];
      const frndID = friend.id;
      const friendData = friend.data();

      // Step 2: Check if already connected
      const currentUserRef = doc(usersRef, user?.userId);
      const friendUserRef = doc(usersRef, frndID);

      const currentUserDoc = await getDoc(currentUserRef);
      const friends = currentUserDoc.data()?.friends || [];

      if (friends.includes(frndID)) {
        Alert.alert("Already added to Friends.");
        setAdding(false);
        return;
      }

      // Step 3: Update both users' friend arrays
      await updateDoc(currentUserRef, {
        friends: arrayUnion(frndID),
      });
      await updateDoc(friendUserRef, {
        friends: arrayUnion(user?.userId),
      });

      // Call the callback to immediately add the user
      addNewFriend({
        ...friendData,
        userId: frndID,
        lastMessage: null, // Set last message to null initially
      });

      Alert.alert("Friend Added!");

      setModalVisible(false);
      setFrndProfile("");
    } catch (error) {
      console.error("Error adding friend: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setAdding(false); // Stop loading
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popUpView}>
          <Text style={styles.title}>Add Friend</Text>

          <TextInput
            value={frndProfile}
            onChangeText={(text) => setFrndProfile(text)}
            placeholder="Enter friend's profile"
            placeholderTextColor={theme.placeholder}
            style={styles.input}
          />

          <View style={styles.btnContainer}>
            <TouchableOpacity
              className="rounded-lg"
              style={[
                styles.btnAdd,
                adding ? { backgroundColor: "gray" } : {}, // Disable button if loading
              ]}
              onPress={handleAddFriend}
              disabled={adding}
            >
              <Text style={styles.txtAdd}>{adding ? "Adding..." : "Add"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex items-center justify-center border rounded-lg ${colorScheme === "dark" ? "border-gray-700" : "border-black"}`}
              style={styles.btnCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.txtCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    popUpView: {
      width: 300,
      backgroundColor: theme.appBg,
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      color: theme.glow,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
    },
    input: {
      height: 40,
      borderColor: colorScheme === "dark" ? "gray" : "black",
      borderWidth: 1,
      width: "100%",
      marginBottom: 20,
      paddingHorizontal: 10,
      borderRadius: 8,
      color: theme.text,
    },
    btnContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    btnAdd: {
      backgroundColor: colorScheme === "dark" ? "#373d48" : theme.text,
      padding: 15,
      alignItems: "center",
      width: 70,
    },
    btnCancel: {
      width: 70,
    },
    txtAdd: {
      color: "white",
      fontWeight: "bold",
    },
    txtCancel: {
      textAlign: "center",
      color: "red",
      fontSize: 16,
    },
  });
}
