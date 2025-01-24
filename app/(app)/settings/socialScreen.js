import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect } from "react";
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

  
  return (
    <View style={styles.container}>
      <SearchBar
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
          height: 20,
          backgroundColor: theme.tint,
        }}
        // ref={}
      />
      <FriendList />
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
