import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

export default function ModalBottomSheet({ modalVisible, setModalVisible, children }) {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  // Pre-calculate height values
  const hp30 = hp("30%"); // Mid snap point
  const hp70 = hp("70%"); // Full height snap point

  // Gesture control
  const translateY = useSharedValue(hp30); // Modal starts at hp(30%)
  const snapPoints = [0, hp30, hp70]; // Bottom (close), Mid, Full height

  const handleDragEnd = (gesture) => {
    const { translationY, velocityY } = gesture;

    // Determine the closest snap point
    let targetPoint = snapPoints[1]; // Default: Mid (hp(30%))
    if (translationY + velocityY * 0.2 > hp30) {
      targetPoint = snapPoints[2]; // Full height (hp(70%))
    } else if (translationY + velocityY * 0.2 < 0) {
      targetPoint = snapPoints[0]; // Close
    }

    // Animate to the closest snap point
    translateY.value = withSpring(targetPoint, {
      damping: 15,
      stiffness: 150,
    });

    // Close modal if dragged to the bottom snap point
    if (targetPoint === snapPoints[2]) {
      runOnJS(setModalVisible)(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: hp70 - translateY.value, // Adjust height dynamically
  }));

  useEffect(() => {
    if (modalVisible) {
      // Open at the mid-point
      translateY.value = withSpring(hp30, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [modalVisible]);

  const closeModal = () => {
    translateY.value = withSpring(snapPoints[0]);
    setTimeout(() => setModalVisible(false), 300); // Close after animation
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={closeModal}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            
            <PanGestureHandler
              onGestureEvent={({ nativeEvent }) => {
                translateY.value = Math.max(0, nativeEvent.translationY);
              }}
              onEnded={(event) => runOnJS(handleDragEnd)(event.nativeEvent)}
            >
              <View
                style={{ flex: 1, justifyContent: "flex-end" }}
                onStartShouldSetResponder={() => true} 
                onMoveShouldSetResponder={() => true} 
              >
                <Animated.View style={[styles.popupView, animatedStyle]}>
                  {/* Modal Content */}
                  <View style={styles.handleBarContainer}>
                    <View
                      style={{
                        height: 3,
                        width: 35,
                        backgroundColor:
                          colorScheme === "dark" ? "white" : "black",
                        borderRadius: 50,
                      }}
                    />
                  </View>
                  {children}
                </Animated.View>
              </View>
            </PanGestureHandler>
          </View>
        </TouchableWithoutFeedback>
      </GestureHandlerRootView>
    </Modal>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent background
    },
    popupView: {
      width: wp(100),
      backgroundColor: theme.appBg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 0,
      paddingBottom: 20,
      paddingHorizontal: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, 
    },
    handleBarContainer: {
      alignItems: "center",
      paddingVertical: 16,
    },
    title: {
      fontSize: 18,
      textAlign: "center",
      color: theme.text,
    },
  });
}
