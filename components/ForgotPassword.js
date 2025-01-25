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
import React, { useContext, useState } from "react";
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { ThemeContext } from "../context/ThemeContext";
import { useAlert } from "../context/alertContext";

export default function ForgotPassword({ setModalVisible, modalVisible }) {
  const [email, setEmail] = useState("");

  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);
  
  const {showAlert} = useAlert()
  
  const handlePasswordReset = async () => {
    const trimmedEmail = email.trim();
    console.log(trimmedEmail);

    if (trimmedEmail === "") {
      showAlert("Forgot Password", "Enter your email");
      return;
    }

    try {
      // Fetch the sign-in methods for the given email
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        trimmedEmail
      );
      // const isEmail = await auth.getUserByEmail(trimmedEmail)

      console.log(signInMethods);
      // console.log(isEmail);

      if (signInMethods.length > 0) {
        // Send the password reset email if the user exists
        await sendPasswordResetEmail(auth, trimmedEmail);
        showAlert("Success", "Password reset email sent!");
        setModalVisible(false);
      } else {
        showAlert(
          "Error",
          "We are unable to find a user with this email for B_Chat App"
        );
        setEmail(""); // Clear the email input field
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      showAlert("Error", error.message);
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
            placeholderTextColor={theme.placeholder}
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
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setEmail("");
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
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
      justifyContent: "center", // Center the modal vertically
      alignItems: "center", // Center horizontally
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    },
    popupView: {
      width: 300,
      backgroundColor: theme.appBg,
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
      color : theme.glow,
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
      color : theme.text,
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
}
