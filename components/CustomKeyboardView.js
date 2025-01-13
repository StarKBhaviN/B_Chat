import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useEffect } from "react";

const ios = Platform.OS === "ios";

export default function CustomKeyboardView({ children, inChat, setInChat }) {
  // Dynamic configuration based on inChat
  const kavConfig = {
    behavior: ios ? "padding" : "height",
    keyboardVerticalOffset: inChat ? 90 : 50, // Adjust offset dynamically
    style: { flex: 1 },
  };

  const scrollViewConfig = {
    contentContainerStyle: { flex: inChat ? 1 : 1 }, // Can add more styles as needed
    keyboardShouldPersistTaps: "handled",
    bounces: false,
    showsVerticalScrollIndicator: false,
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setInChat(true); // Set inChat to true when keyboard is visible
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setInChat(false); // Set inChat to false when keyboard is hidden
    });

    return () => {
      // Cleanup subscriptions to prevent memory leaks
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [setInChat]);
  console.log("inChat:", inChat, "keyboardVerticalOffset:", kavConfig.keyboardVerticalOffset);

  return (
    <KeyboardAvoidingView {...kavConfig}>
      <ScrollView {...scrollViewConfig}>{children}</ScrollView>
    </KeyboardAvoidingView>
  );
}
