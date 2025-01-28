import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import FriendItem from "./FriendItem";
import { useFriendContext } from "../context/friendContext";
import { ThemeContext } from "../context/ThemeContext";
import { Image } from "expo-image";
import BeePNG from "../assets/images/BeePNG.png";

export default function FriendList({ searchTerm }) {
  const { theme } = useContext(ThemeContext);
  const { fetchAllFriends, getAllFriendData, removeAsFriend } =
    useFriendContext();

  useEffect(() => {
    getAllFriendData();
  }, []);

  const filteredFriends = fetchAllFriends.filter((friend) =>
    friend.profileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine the time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Break-fast";
    } else if (hour >= 12 && hour < 14) {
      return "Lunch";
    } else if (hour >= 14 && hour < 19) {
      return "Snacks";
    } else {
      return "Dinner";
    }
  };

  const timeOfDay = getTimeOfDay();

  if (filteredFriends.length === 0) {
    return (
      <View style={styles.notFound}>
        <Image
          source={BeePNG}
          style={{ width: 100, height: 100, marginBottom: 20 }}
        />
        <Text
          className="text-xl text-center w-80"
          style={{ color: theme.text }}
        >
          Your Favourite Bee is Enjoying {timeOfDay}. 🐝
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "row", // Arrange items in a row initially
        flexWrap: "wrap", // Allow wrapping to the next line
        // justifyContent: "space-between", // Add spacing between items
        paddingHorizontal: 7,
        borderWidth: 0,
      }}
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
      }}
    >
      {filteredFriends.map((item, index) => {
        return (
          <FriendItem
            key={item.userId}
            item={item}
            removeAsFriend={removeAsFriend}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 30,
  },
});
