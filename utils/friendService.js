import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../firebaseConfig";

export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    const receiverDocRef = doc(usersRef, receiverId);

    // Add the senderId to the receiver's friendRequests array
    await updateDoc(receiverDocRef, {
      friendRequests: arrayUnion(senderId),
    });

    return "Friend request sent successfully.";
  } catch (error) {
    console.error("Error sending friend request:", error);
    return "Failed to send friend request.";
  }
};

export const getFriendRequests = async (userId) => {
  try {
    const userDocRef = doc(usersRef, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const friendRequests = userDoc.data().friendRequests || [];

      // Fetch details of users who sent friend requests
      const friendRequestsData = await Promise.all(
        friendRequests.map(async (friendId) => {
          const friendDocRef = doc(usersRef, friendId);
          const friendDoc = await getDoc(friendDocRef);

          if (friendDoc.exists()) {
            const { profileName, profileURL } = friendDoc.data();
            return { friendId, profileName, profileURL };
          }
          return null;
        })
      );

      // Filter out null values (e.g., in case of missing documents)
      return friendRequestsData.filter((data) => data !== null);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error retrieving friend requests:", error);
    return [];
  }
};

export const acceptFriendRequest = async (userId, friendId) => {
  try {
    const userDocRef = doc(usersRef, userId);
    const friendDocRef = doc(usersRef, friendId);

    // Add friendId to user's friends array and vice versa
    await updateDoc(userDocRef, {
      friends: arrayUnion(friendId),
      friendRequests: arrayRemove(friendId), // Remove friendId from friendRequests
    });

    await updateDoc(friendDocRef, {
      friends: arrayUnion(userId),
    });

    return "Friend request accepted.";
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return "Failed to accept friend request.";
  }
};
