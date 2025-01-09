import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import React from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

export default function MessageOpModal({
  modalVisible,
  setModalVisible,
  modalPosition,
}) {
  return (
    <Modal
      visible={modalVisible}
      transparent={true} // Makes the modal transparent
      animationType="fade" // Smooth slide effect
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.popupView,{position : "absolute", top : modalPosition.top, left : modalPosition.left}]}>
              <TouchableOpacity style={styles.innerBtns}>
                <MaterialIcons style={{marginRight : 6}} name="delete-forever" size={20} color={"white"}/>
                <Text style={styles.modalText}>Delete For Everyone</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.innerBtns}>
                <MaterialIcons style={{marginRight : 6}} name="delete" size={20} color={"white"}/>
                <Text style={styles.modalText}>Delete For Me</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.innerBtns}>
                <Entypo style={{marginRight : 6}} name="forward" size={20} color={"white"}/>
                <Text style={styles.modalText}>Forward Message</Text>
              </TouchableOpacity>
              <View style={{display : "flex", alignItems : "flex-end", justifyContent : "flex-end", width : 200, padding : 4, paddingRight : 12}}>
                <Text style={[styles.modalText,{fontSize : 12, color : "rgb(165, 159, 159)"}]}>Delivered @ 10.00 PM</Text>
                <Text style={[styles.modalText,{fontSize : 12, color : "rgb(165, 159, 159)"}]}>Readed @ 10.40 PM</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popupView: {
    flex : 1,
    justifyContent : "flex-start",
    alignItems: "flex-start",
    // width: 200,
    backgroundColor: "rgb(39, 36, 36)",
    borderRadius: 10,
    // paddingHorizontal: 15,
    paddingVertical : 6,
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
  innerBtns : {
    flex : 1,
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "flex-start",
    // backgroundColor : "red",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical : 10,
    width : 200
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
  modalText : {
    color : "white"
  }
});
