import { ScrollView, View } from "react-native";
import React, { useEffect } from "react";
import FriendItem from "./FriendItem";
import { useFriendContext } from "../context/friendContext";

export default function FriendList() {
  const { fetchAllFriends, getAllFriendData, removeAsFriend } = useFriendContext();

  useEffect(() => {
    console.log("Running this")
    getAllFriendData();
  }, [removeAsFriend]);

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
      {fetchAllFriends.map((item, index) => {
        console.log(item.profileName)
        return <FriendItem key={index} item={item} removeAsFriend={removeAsFriend}/>;
      })}
    </ScrollView>
  );
}
