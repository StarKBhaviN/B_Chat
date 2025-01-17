import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

export default function MessageOpModal({
  modalVisible,
  setModalVisible,
  modalPosition,
  messageData,
  showReadStatus,
  handleDelete,
}) {
  console.log(messageData);

  const formatTimestamp = (timestamp) => {
    if (timestamp === undefined || timestamp === null) {
      return "Unreaded";
    }
    const { seconds, nanoseconds } = timestamp;
    const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1e6);
    const date = new Date(milliseconds);

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "P.M." : "A.M.";
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

    if (isToday) {
      return `Today @ ${timeString}`;
    } else {
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      return `${formattedDate} ${timeString}`;
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true} // Makes the modal transparent
      animationType="fade" // Smooth slide effect
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          {/* <TouchableWithoutFeedback> */}
          <View
            style={[
              styles.popupView,
              {
                position: "absolute",
                top: modalPosition.top,
                left: modalPosition.left,
              },
            ]}
          >
            {showReadStatus && (
              <TouchableOpacity
                style={styles.innerBtns}
                onPress={() => handleDelete(messageData?.messageId)}
              >
                <MaterialIcons
                  style={{ marginRight: 6 }}
                  name="delete-forever"
                  size={20}
                  color={"white"}
                />
                <Text style={styles.modalText}>Delete For Everyone</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.innerBtns}
              onPress={() => console.log("Delete for me")}
            >
              <MaterialIcons
                style={{ marginRight: 6 }}
                name="delete"
                size={20}
                color={"white"}
              />
              <Text style={styles.modalText}>Delete For Me</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.innerBtns}>
              <Entypo
                style={{ marginRight: 6 }}
                name="forward"
                size={20}
                color={"white"}
              />
              <Text style={styles.modalText}>Forward Message</Text>
            </TouchableOpacity>
            <View
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                width: 200,
                padding: 4,
                paddingRight: 12,
              }}
            >
              <View className="flex flex-row items-center">
                <Text
                  style={[
                    styles.modalText,
                    { fontSize: 12, color: "rgb(165, 159, 159)" },
                  ]}
                >
                  {formatTimestamp(messageData?.localSendTime)}
                </Text>
                <Text style={{ fontSize: 8, marginLeft: 4 }}>🟠🟠</Text>
              </View>
              {showReadStatus && (
                <View className="flex flex-row items-center">
                  <Text
                    style={[
                      styles.modalText,
                      { fontSize: 12, color: "rgb(165, 159, 159)" },
                    ]}
                  >
                    {formatTimestamp(messageData?.readTime)}
                  </Text>
                  <Text style={{ fontSize: 8, marginLeft: 4 }}>🟢🟢</Text>
                </View>
              )}
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popupView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // width: 200,
    backgroundColor: "rgb(39, 36, 36)",
    borderRadius: 10,
    // paddingHorizontal: 15,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  innerBtns: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // backgroundColor : "red",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: 200,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancel: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
  modalText: {
    color: "white",
  },
});
