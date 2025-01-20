import moment from "moment";
import * as ImagePicker from "expo-image-picker";

export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const getRoomID = (myUser, frndUser) => {
  const sortedIDs = [myUser, frndUser].sort();
  const roomId = sortedIDs.join("-");
  return roomId;
};

// Function to convert Firestore timestamp to human-readable format
export const formatMessageTime = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return "";

  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();

  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} min ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  } else if (moment(date).isSame(now, "day")) {
    return `Today at ${moment(date).format("h:mm A")}`;
  } else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
    return `Yesterday at ${moment(date).format("h:mm A")}`;
  } else {
    return moment(date).format("MMM D, YYYY [at] h:mm A");
  }
};

export const pickImage = async (setImage) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "Please allow access to your photos.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    console.log('Picked image URI:', result.assets[0].uri);
    setImage(result.assets[0].uri);
  }
};
