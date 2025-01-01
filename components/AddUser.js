import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useAuth } from "../context/authContext";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { usersRef } from "../firebaseConfig";

export default function AddUser({ modalVisible, setModalVisible, refreshUsers }) {
  const [frndProfile, setFrndProfile] = useState("");

  const { user } = useAuth();

  const handleAddFriend = async () => {
    if (!user) {
      return;
    }

    console.log("Friend : ", frndProfile);


    // Step 1 : Search for user by profile name
    const qry = query(usersRef, where("profileName", "==", frndProfile));
    const qrySnapShot = await getDocs(qry);

    if (qrySnapShot.empty) {
      Alert.alert("User Not Found");
      return;
    }

    const friend = qrySnapShot.docs[0];
    const frndID = friend.id;

    console.log("Friend ID : ", frndID);
    console.log("User ID : ", user.userId);
    
    // Step 2 : Check if already connected
    const currentUserRef = doc(usersRef, user?.userId);
    const friendUserRef = doc(usersRef, frndID);
    
    console.log("Friend ID : ", currentUserRef);
    console.log("User ID : ", friendUserRef);
    const currentUserDoc = await getDoc(currentUserRef);
    const friends = currentUserDoc.data()?.friends || [];

    if (friends.includes(frndID)) {
      Alert.alert("Already added to Friends.");
      return;
    }

    // Step 3 : Update both users' friend arrays
    await updateDoc(currentUserRef, {
      friends: arrayUnion(frndID),
    });
    await updateDoc(friendUserRef, {
      friends: arrayUnion(user?.userId),
    });

    Alert.alert("Friend Added!!!");

    refreshUsers()
    setModalVisible(false)
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
            placeholder="Enter your friend's profile"
            style={styles.input}
          />

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={{ backgroundColor: "blue", padding: 15, borderRadius: 8 }}
              onPress={handleAddFriend}
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.btnCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popUpView: {
    width: 300,
    backgroundColor: "#fff",
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  btnCancel: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
});
