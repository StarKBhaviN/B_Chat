import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TouchableWithoutFeedback } from "react-native";
import { useAuth } from "../context/authContext";
import { Tooltip } from "react-native-elements";
import { AntDesign, Entypo } from "@expo/vector-icons";

export default function ProfileEditModal({
  showEditModal,
  setShowEditModal,
  fieldName,
  fetchUserData
}) {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const { editProfile, checkProfileNameAvailability } = useAuth();
  const inputRef = useRef(null); // Reference for the TextInput

  const [newValue, setNewValue] = useState("");
  const [isAvailable, setIsAvailable] = useState(null); // State for name availability
  const [isLoading, setIsLoading] = useState(false); // State for loading availability check

  useEffect(() => {
    if (showEditModal) {
      // Delay focusing to ensure the modal is fully rendered
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [showEditModal]);

  useEffect(() => {
    if (fieldName === "Name") {
      // Real-time validation for profile name
      const validateName = async () => {
        if (!newValue.trim()) {
          setIsAvailable(null);
          return;
        }

        setIsLoading(true); // Indicate loading
        const available = await checkProfileNameAvailability(newValue.trim());
        setIsAvailable(available);
        setIsLoading(false); // Reset loading
      };

      // Debounce the API call to avoid excessive requests
      const timeout = setTimeout(() => {
        validateName();
      }, 300);
      return () => clearTimeout(timeout); // Clear timeout on component unmount or value change
    }
  }, [newValue]);

  const handleNameUpdate = async () => {
    if (isAvailable) {
      await editProfile({ profileName: newValue });
      fetchUserData()
      setShowEditModal(false)
      setNewValue("")
    }
  };
  
  const handleBioUpdate = async () => {
    await editProfile({ bio: newValue });
    fetchUserData()
    setShowEditModal(false)
    setNewValue("")
    // await editProfile({ profileName: "New Profile Name" });
  };

  return (
    <Modal
      visible={showEditModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEditModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowEditModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.popupView}>
            <View style={styles.modalBody}>
              <View className="mt-1">
                <Text style={styles.modalTitle} className="mb-2">
                  {fieldName === "Name"
                    ? "Change Bee Name"
                    : "Update Bee Acheivements"}
                </Text>
              </View>
              <View className="flex flex-row justify-between mb-2">
                <View className="flex-row items-center justify-start">
                  <TextInput
                    ref={inputRef}
                    value={newValue}
                    style={styles.textInput}
                    onChangeText={(text) => setNewValue(text)}
                    className="py-2 px-0"
                    placeholder={
                      fieldName === "Name" ? "Enter a Unique Bee name" : ""
                    }
                    placeholderTextColor={theme.placeholder}
                    autoFocus={false}
                  />
                  {isAvailable === null ? (
                    ""
                  ) : isAvailable ? (
                    <AntDesign
                      name="checkcircle"
                      size={24}
                      color={theme.icon}
                      style={{ position: "absolute", right: 0 }}
                    />
                  ) : (
                    <Entypo
                      name="circle-with-cross"
                      size={24}
                      color={"red"}
                      style={{ position: "absolute", right: 0 }}
                    />
                  )}
                </View>
                <TouchableOpacity
                  className="flex items-center justify-center rounded-lg"
                  style={styles.btnDone}
                  onPress={
                    fieldName === "Name" ? handleNameUpdate : handleBioUpdate
                  }
                  disabled={(fieldName==="Name" && (!isAvailable || isLoading)) || !newValue.trim()}
                >
                  <Text style={{ color: theme.text }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end", // Center the modal vertically
      alignItems: "center", // Center horizontally
      backgroundColor: "rgba(0, 0, 0, 0.9)", // Semi-transparent background
    },
    popupView: {
      width: wp(100),
      backgroundColor: theme.appBg,
      borderRadius: 20,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      padding: 14,
      paddingHorizontal : 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, // Shadow for Android
    },
    modalTitle: {
      color: theme.glow,
    },
    textInput: {
      width: wp(68),
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      color: theme.text,
    },
    btnDone: {
      width: wp(20),
      backgroundColor: theme.tint,
    },
  });
}
