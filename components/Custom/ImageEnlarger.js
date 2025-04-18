import React, { useState, useContext } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

const ImageEnlarger = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  // Open modal when the thumbnail is pressed.
  const handleOpen = () => setModalVisible(true);
  // Close modal when overlay is pressed.
  const handleClose = () => setModalVisible(false);

  return (
    <>
      <TouchableOpacity onPress={handleOpen}>
        {children}
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <View style={styles.enlargedContainer}>
              {/* Clone the child element while applying enlarged styling */}
              {React.cloneElement(children, {
                style: [children.props.style, styles.enlargedImage],
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default ImageEnlarger;

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    enlargedContainer: {
      backgroundColor: colorScheme === "dark" ? "rgb(36, 35, 43)" : "white",
      borderRadius: 12,
      elevation: 10,
      height: 345
    },
    enlargedImage: {
      width: 300, // New width for the enlarged version
      height: 300, // New height for the enlarged version
      resizeMode: "contain",
      borderRadius: 12,
      borderBottomRightRadius : 0,
      borderBottomLeftRadius : 0
    },
  });
}
