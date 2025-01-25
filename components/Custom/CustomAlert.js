import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "../../context/ThemeContext";

export default function CustomAlert({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
}) {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={styles.alertMessage}>{message}</Text>

            <View style={styles.buttonsContainer}>
              {confirmText && (
                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </TouchableOpacity>
              )}

              {cancelText && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>{cancelText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    alertContainer: {
      width: wp(80),
      backgroundColor: colorScheme === "dark" ? "rgb(36, 35, 43)" : "white",
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: "start",
      elevation: 10,
    },
    alertTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.glow,
      marginBottom: 10,
    },
    alertMessage: {
      fontSize: 16,
      color: theme.glow,
      marginBottom: 20,
      textAlign: "left",
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: colorScheme === "dark" ? "rgb(78, 141, 84)":"#4CAF50", // green for confirm button
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: colorScheme==="dark" ? "rgb(141, 78, 78)" :"#f44336", // red for cancel button
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  });
}
