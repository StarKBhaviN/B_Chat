import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  getAuth,
  reload,
  sendEmailVerification,
  updateEmail as firebaseUpdateEmail,
} from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import CustomAlert from "../../../components/Custom/CustomAlert";
import { useAlert } from "../../../context/alertContext";

export default function EmailVerification() {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser; // Get the currently signed-in user
  const db = getFirestore(); // Initialize Firestore
  const [isVerified, setIsVerified] = useState(user?.emailVerified || false);
  const [newEmail, setNewEmail] = useState(user?.email || ""); // Input for updating email

  const {showAlert} = useAlert()
  // Refresh user state to ensure emailVerified is up-to-date
  useEffect(() => {
    const refreshUser = async () => {
      try {
        await reload(user); // Reload user state from Firebase
        setIsVerified(user.emailVerified); // Update verification status
      } catch (error) {
        console.error("Failed to reload user:", error);
      }
    };

    refreshUser();
  }, [user]);

  const handleVerify = async () => {
    try {
      await sendEmailVerification(user); // Send verification email
      showAlert("Email Verify", "Email Verification Mail Sent.")
    } catch (error) {
      showAlert("Email Verify Error", "Failed to send verification email. Please try again.")
    }
  };
  
  const handleUpdateEmail = async () => {
    if (newEmail.trim() === "") {
      showAlert("Error", "Email cannot be empty.")
      return;
    }

    try {
      // Update email in Firebase Authentication
      await firebaseUpdateEmail(user, newEmail);

      // Update email in Firestore user document
      const userDocRef = doc(db, "users", user.uid); // Assuming Firestore collection is 'users'
      await updateDoc(userDocRef, {
        email: newEmail,
      });

      showAlert("Success", "Email updated successfully!");
    } catch (error) {
      console.error("Error updating email:", error);
      showAlert("Error", "Failed to update email. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View className="gap-2">
        <Text style={styles.heading}>Your Email</Text>
        <View className="flex flex-row justify-between">
          <TextInput
            style={styles.emailInput}
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Enter new email"
            placeholderTextColor={theme.placeholder}
            editable={isVerified} // Allow editing only if verified
          />
          <Pressable
            className="flex items-center justify-center rounded-lg"
            style={styles.btnVerify}
            onPress={isVerified ? handleUpdateEmail : handleVerify}
          >
            <Text style={{ color: theme.glow }}>
              {isVerified ? "Update" : "Verify"}
            </Text>
          </Pressable>
        </View>

        
        <Text className="mt-2" style={{ color: theme.placeholder }}>
          {isVerified
            ? "Update your Email address."
            : "Verify your Email to get the latest updates and features like password change."}
        </Text>
      </View>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    heading: {
      fontSize: 16,
      color: theme.glow,
    },
    emailInput: {
      width: wp(65),
      color: theme.text,
      fontSize: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingVertical: 5,
    },
    btnVerify: {
      backgroundColor: theme.tint,
      width: wp(20),
      padding: 4,
    },
  });
}
