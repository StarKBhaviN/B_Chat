import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BeeRequest from "../../components/BeeRequest";
import { ThemeContext } from "../../context/ThemeContext";
import { SequencedTransition } from "react-native-reanimated";
import { useAuth } from "../../context/authContext";
import { getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";

export default function beez() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();

  const [reqs, setReqs] = useState([]);

  const getFrndReqs = async () => {
    const userQry = query(usersRef, where("userId", "==", user?.userId));
    const snapshot = await getDocs(userQry);

    let friendRequests = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.friendReqs) {
        friendRequests = friendRequests.concat(data.friendReqs);
      }
    });

    // console.log("Friend Requests IDs:", friendRequests);

    // Fetch data for each friendReq userId
    const friendDataPromises = friendRequests.map(async (friendId) => {
      const friendQuery = query(usersRef, where("userId", "==", friendId));
      const friendSnapshot = await getDocs(friendQuery);

      const friendData = [];
      friendSnapshot.forEach((doc) => {
        const { profileName, profileURL } = doc.data();
        friendData.push({
          profileName,
          profileURL,
          sendReqMsg: "Hey, Add me as friend!!!",
          userId: doc.id,
        }); // Add doc.id for reference if needed
      });

      return friendData[0]; // Assuming there's only one document per userId
    });

    const friendsData = await Promise.all(friendDataPromises);

    setReqs(friendsData); // Update state with detailed friend data
  };

  console.log(user)
  useEffect(() => {
    getFrndReqs();
  }, [user]);

  return (
    <View className="flex-1 px-4 py-2" style={{ backgroundColor: theme.appBg }}>
      <Text className="mb-1" style={{ color: theme.glow }}>
        New Beez
      </Text>
      {/* Friend requests */}
      <View
        className="border rounded-xl p-2 mb-4"
        style={{ maxHeight: hp(40), borderColor: theme.border }}
      >
        {/* <ScrollView showsVerticalScrollIndicator={false} bounces={true}> */}
        <Animated.FlatList
          itemLayoutAnimation={SequencedTransition}
          data={reqs}
          // contentContainerStyle={{ paddingVertical: 8 }}
          keyExtractor={(item) => item.userId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            console.log(item);
            return <BeeRequest data={item} index={index} user={user} />;
          }}
        />
        {/* </ScrollView> */}
      </View>

      {/* Other notifications */}
      <Text className="mb-1" style={{ color: theme.glow }}>
        Bee's anouncements
      </Text>

      <View
        className="border rounded-xl p-2 mb-4"
        style={{ maxHeight: hp(40), borderColor: theme.border }}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
          {/* Ahiya j flatList aavse ema announcement data moklvana */}
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
          <BeeRequest />
        </ScrollView>
      </View>
    </View>
  );
}
