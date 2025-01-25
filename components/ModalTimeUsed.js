import {
  View,
  Text,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ModalTimeUsed({ modalVisible, setModalVisible }) {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [timeUsedToday, setTimeUsedToday] = useState(0); // State to store time used today

  useEffect(() => {
    const getTimeUsed = async () => {
      try {
        const storedTime = await AsyncStorage.getItem("elapsedTime"); // Retrieve time from AsyncStorage
        if (storedTime) {
          setTimeUsedToday(Number(storedTime)); // Set the retrieved time
        }
      } catch (error) {
        console.error("Error fetching time from AsyncStorage", error);
      }
    };

    if (modalVisible) {
      getTimeUsed(); // Fetch time when modal is visible
    }
  }, [modalVisible]); // Only run when modal is visible

  // Function to format the time in a readable format (minutes)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    return `${minutes} mins`;
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.popupView}>
            <View className="flex flex-row justify-between items-start mb-9">
              <Text style={styles.title}>Daily B_Chat Limit</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                style={{
                  height: 30,
                  width: 30,
                  borderWidth: 2,
                  borderColor: "red",
                }}
                value={isEnabled}
              />
            </View>

            <View className="flex flex-row items-center mb-9">
              <Ionicons name="alarm-outline" size={30} color={theme.icon} />
              <View className="ms-3">
                <Text className="text-lg" style={{ color: theme.text }}>
                  {formatTime(timeUsedToday)}/90 Mins
                </Text>
                <Text className="text-xs" style={{ color: theme.placeholder }}>
                  Used Today
                </Text>
              </View>
            </View>

            <View>
              <View className="flex flex-row items-center mb-4">
                <TextInput
                  value="1"
                  className="flex-1 border-b py-1 "
                  style={{ borderColor: theme.border, color: theme.text }}
                />
                <Text style={{ color: theme.placeholder }}>Mins</Text>
              </View>
              <View className="flex flex-row justify-around">
                <TouchableOpacity style={styles.btnChips}>
                  <Text
                    className="text-sm"
                    style={{ color: theme.placeholder }}
                  >
                    30mins
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnChips}>
                  <Text
                    className="text-sm"
                    style={{ color: theme.placeholder }}
                  >
                    45mins
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnChips}>
                  <Text
                    className="text-sm"
                    style={{ color: theme.placeholder }}
                  >
                    60mins
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnChips}>
                  <Text
                    className="text-sm"
                    style={{ color: theme.placeholder }}
                  >
                    90mins
                  </Text>
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
      justifyContent: "center", // Center the modal vertically
      alignItems: "center", // Center horizontally
      backgroundColor: "rgba(0, 0, 0, 0.9)", // Semi-transparent background
    },
    popupView: {
      width: wp(80),
      backgroundColor: theme.appBg,
      borderRadius: 12,
      padding: 14,
      paddingHorizontal: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, // Shadow for Android
    },
    title: {
      fontSize: 22,
      color: theme.glow,
    },
    btnChips: {
      backgroundColor: theme.tint,
      padding: 6,
      borderRadius: 12,
    },
  });
}
