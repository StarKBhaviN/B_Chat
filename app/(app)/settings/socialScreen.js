import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "../../../context/ThemeContext";
import FriendList from "../../../components/FriendList";
import { SearchBar } from "react-native-elements";

export default function socialScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Delay in milliseconds

    return () => clearTimeout(handler); // Cleanup timeout on unmount or re-typing
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <SearchBar
        key="search-bar"
        placeholder="Search for Beez by Name..."
        placeholderTextColor={theme.placeholder}
        onChangeText={(text) => setSearchTerm(text)}
        containerStyle={{
          height: 50,
          backgroundColor: "transparent",
          borderWidth: 0,
          borderColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
        }}
        inputContainerStyle={{
          padding: 0,
          height: 30,
          backgroundColor: theme.tint,
        }}
        inputStyle={{
          color: theme.glow,
          fontSize: 15,
        }}
        value={searchTerm}
        // ref={searchRef}
      />
      <FriendList searchTerm={debouncedSearchTerm} />
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      // paddingVertical: 12,
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
