import {
  Modal,
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function ForgotPassword({ setModalVisible, modalVisible }) {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    console.log(email)
    if (email === "") {
      Alert.alert("Forgot Password", "Enter your email");
      return;
    }
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length > 0) {
        await sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert("Success", "Password reset email sent!");
          setModalVisible(false);
        })
        .catch((e) => {
          console.error("Error: ", e);
          Alert.alert("Error", e.message);
        });
      } else {
        Alert.alert("Error", "We are unable to find user with this Email for B_Chat App")
        setEmail("")
      }
      
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true} // Makes the modal transparent
      animationType="slide" // Smooth slide effect
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popupView}>
          <Text style={styles.title}>Forgot Password</Text>

          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email"
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handlePasswordReset}
              style={{ backgroundColor: "blue", padding: 15, borderRadius: 8 }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Reset Password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(false); setEmail("")}}>
              <Text style={styles.cancel}>Cancel</Text>
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
    justifyContent: "center", // Center the modal vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  popupView: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
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
});
