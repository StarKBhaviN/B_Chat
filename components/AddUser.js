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
import { ThemeContext } from "../context/ThemeContext";
import { useFriendContext } from "../context/friendContext";
import { getReceiverIdByProfileName } from "../utils/friendService";
import { useAlert } from "../context/alertContext";

export default function AddUser({ modalVisible, setModalVisible }) {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const { showAlert } = useAlert();

  const [receiverName, setReceiverName] = useState("");
  const [reqMessage, setReqMessage] = useState("");

  const [adding, setAdding] = useState(false); // State to track loading
  const { user } = useAuth();

  const { sendRequest } = useFriendContext();

  const handleSendRequest = async () => {
    setAdding(true);
    // Sender : user.userId | Receiver : Other person
    if (!user?.userId || !receiverName.trim()) {
      showAlert("Error", "Please enter a valid profile name.");
      setAdding(false)
      return;
    }

    try {
      const receiverId = await getReceiverIdByProfileName(receiverName.trim());
      const result = await sendRequest(
        user.userId,
        receiverId,
        reqMessage.trim() || "Heyy!!! Add me to have a Bee 👋😉"
      );

      showAlert(
        `Request Status : ${result.Success ? "Success" : "Failed"}`,
        result.Message
      );

      setReceiverName("");
      setReqMessage("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error in handleSendRequest:", error.message);
      showAlert("Error", "Failed to send friend request.");
    } finally {
      setAdding(false);
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
            value={receiverName}
            onChangeText={(text) => setReceiverName(text)}
            placeholder="Enter Bee's profile"
            placeholderTextColor={theme.placeholder}
            style={[styles.input, { marginBottom: 10 }]}
          />

          <TextInput
            value={reqMessage}
            onChangeText={(text) => setReqMessage(text)}
            placeholder="Send a message with request 😉"
            placeholderTextColor={theme.placeholder}
            style={styles.input}
            maxLength={52}
          />

          <View style={styles.btnContainer}>
            <TouchableOpacity
              className="rounded-lg"
              style={[
                styles.btnAdd,
                adding ? { backgroundColor: "gray" } : {}, // Disable button if loading
              ]}
              onPress={handleSendRequest}
              disabled={adding}
            >
              <Text style={styles.txtAdd}>{adding ? "Adding..." : "Add"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex items-center justify-center border rounded-lg ${
                colorScheme === "dark" ? "border-gray-700" : "border-black"
              }`}
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
      fontSize: 22,
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
      padding: 12,
      alignItems: "center",
      width: 100,
    },
    btnCancel: {
      width: 80,
      padding: 11,
    },
    txtAdd: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    txtCancel: {
      textAlign: "center",
      color: "red",
      fontSize: 16,
    },
  });
}
