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
import React, { useRef, useState } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { auth } from "../firebaseConfig";
import {
  getAuth,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";

export default function PhoneSignIn({ setModalVisible, modalVisible }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const sendVerification = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      setPhoneNumber("");
      Alert.alert("OTP Sent", "Check your phone for the verification code.");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      setCode("");
      Alert.alert("Sign In", "Login Successful!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Invalid Code. Try Again.");
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
          <Text style={styles.title}>Login with Phone</Text>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={auth.app.options}
          />
          <TextInput
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="phone-pad"
            autoComplete="tel"
            placeholder="Enter your Phone No."
            style={styles.input}
          />

          <View style={styles.section2}>
            <TouchableOpacity style={styles.btnOTP} onPress={sendVerification}>
              <Text style={{ color: "black", fontWeight: "bold" }}>
                Get OTP
              </Text>
            </TouchableOpacity>
            <TextInput
              onChangeText={(text) => setCode(text)}
              keyboardType="number-pad"
              placeholder="OTP"
              style={[styles.input, { width: "60%", marginBottom: 0 }]}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={confirmCode}
              style={{
                backgroundColor: "blue",
                padding: 15,
                borderRadius: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
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
  section2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  btnOTP: {
    backgroundColor: "rgb(110, 196, 250)",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 10,
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
