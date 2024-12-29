import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React from "react";

const ios = Platform.OS === "ios";

export default function CustomKeyboardView({ children, inChat }) {
  let kavConfig = {};
  let scrollViewConfig = {};

  if (inChat) {
    kavConfig = { keyboardVerticalOffset: 90 };
    scrollViewConfig = { contentContainerStyle: { flex: 1 } };
  }
  return (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      {...kavConfig}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        {...scrollViewConfig}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
